/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from "../user/user.model";
import { CountryModel } from "../country/country.model";
import { ActivityLog } from "../activity/activityLog.model";

import { Role } from "../user/user.interface";
import { VisaApplicationModel } from "../visaApply/visa.model";
import { VisaApplicationPaymentModel } from "../visaPayment/payment.model";
import { PaymentStatus } from "../visaPayment/payment.interface";
import { ApplicationStatus } from "../visaApply/visa.interface";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const getDateRange = (range?: string) => {
  const now = new Date();
  const months = range === "12m" ? 12 : 6;

  const start = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);
  const end = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999,
  );

  return { start, end, months };
};

const getMonthStartEnd = (offset = 0) => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const end = new Date(
    now.getFullYear(),
    now.getMonth() + offset + 1,
    0,
    23,
    59,
    59,
    999,
  );
  return { start, end };
};

const calcGrowth = (current: number, previous: number) => {
  if (previous === 0 && current === 0) return 0;
  if (previous === 0) return 100;
  return Number((((current - previous) / previous) * 100).toFixed(2));
};

const getAnalytics = async (query: Record<string, any>) => {
  const range = query.range || "6m";
  const { start, end, months } = getDateRange(range);

  const currentMonth = getMonthStartEnd(0);
  const previousMonth = getMonthStartEnd(-1);

  // 1) New users
  const [currentUsers, previousUsers] = await Promise.all([
    User.countDocuments({
      createdAt: { $gte: currentMonth.start, $lte: currentMonth.end },
    }),
    User.countDocuments({
      createdAt: { $gte: previousMonth.start, $lte: previousMonth.end },
    }),
  ]);

  const newUsersGrowth = calcGrowth(currentUsers, previousUsers);

  // 2) Revenue summary
  const [currentRevenueAgg, previousRevenueAgg, totalRevenueAgg] =
    await Promise.all([
      VisaApplicationPaymentModel.aggregate([
        {
          $match: {
            status: PaymentStatus.SUCCESS,
            createdAt: { $gte: currentMonth.start, $lte: currentMonth.end },
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      VisaApplicationPaymentModel.aggregate([
        {
          $match: {
            status: PaymentStatus.SUCCESS,
            createdAt: { $gte: previousMonth.start, $lte: previousMonth.end },
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      VisaApplicationPaymentModel.aggregate([
        {
          $match: {
            status: PaymentStatus.SUCCESS,
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

  const currentRevenue = currentRevenueAgg[0]?.total || 0;
  const previousRevenue = previousRevenueAgg[0]?.total || 0;
  const totalRevenue = totalRevenueAgg[0]?.total || 0;
  const revenueGrowth = calcGrowth(currentRevenue, previousRevenue);

  // 3) Average processing time
  const processingAgg = await VisaApplicationModel.aggregate([
    {
      $match: {
        status: {
          $in: [ApplicationStatus.APPROVED, ApplicationStatus.REJECTED],
        },
      },
    },
    {
      $project: {
        diffInDays: {
          $divide: [
            { $subtract: ["$updatedAt", "$createdAt"] },
            1000 * 60 * 60 * 24,
          ],
        },
      },
    },
    {
      $group: {
        _id: null,
        avgDays: { $avg: "$diffInDays" },
      },
    },
  ]);

  const averageProcessingTimeDays = Math.round(processingAgg[0]?.avgDays || 0);

  // 4) Payment trend
  const paymentTrendAgg = await VisaApplicationPaymentModel.aggregate([
    {
      $match: {
        status: PaymentStatus.SUCCESS,
        createdAt: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        value: { $sum: "$amount" },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
      },
    },
  ]);

  const paymentTrendMap = new Map<string, number>();
  paymentTrendAgg.forEach((item: any) => {
    const key = `${item._id.year}-${item._id.month}`;
    paymentTrendMap.set(key, item.value);
  });

  const paymentTrend = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);

    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const key = `${year}-${month}`;

    paymentTrend.push({
      month: monthNames[month - 1],
      value: paymentTrendMap.get(key) || 0,
    });
  }

  // 5) Application status
  const applicationStatusAgg = await VisaApplicationModel.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const applicationStatus = {
    approved: 0,
    inReview: 0,
    rejected: 0,
    submitted: 0,
    total: 0,
  };

  for (const item of applicationStatusAgg) {
    if (item._id === ApplicationStatus.APPROVED) {
      applicationStatus.approved = item.count;
    } else if (item._id === ApplicationStatus.REJECTED) {
      applicationStatus.rejected = item.count;
    } else if (
      item._id === ApplicationStatus.PROCESSING ||
      item._id === "IN_REVIEW"
    ) {
      applicationStatus.inReview += item.count;
    } else if (
      item._id === ApplicationStatus.PENDING ||
      item._id === "SUBMITTED"
    ) {
      applicationStatus.submitted += item.count;
    }
  }

  applicationStatus.total =
    applicationStatus.approved +
    applicationStatus.inReview +
    applicationStatus.rejected +
    applicationStatus.submitted;

  // 6) Top Services / Countries
  const topServicesCountries = await VisaApplicationModel.aggregate([
    {
      $group: {
        _id: "$visaServiceId",
        applications: { $sum: 1 },
        approvedCount: {
          $sum: {
            $cond: [{ $eq: ["$status", ApplicationStatus.APPROVED] }, 1, 0],
          },
        },
      },
    },
    {
      $lookup: {
        from: "visaservices",
        localField: "_id",
        foreignField: "_id",
        as: "service",
      },
    },
    { $unwind: "$service" },
    {
      $lookup: {
        from: "countries",
        localField: "service.countryId",
        foreignField: "_id",
        as: "country",
      },
    },
    {
      $unwind: {
        path: "$country",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "payments",
        let: { serviceId: "$_id" },
        pipeline: [
          {
            $lookup: {
              from: "visaapplications",
              localField: "applicationId",
              foreignField: "_id",
              as: "application",
            },
          },
          { $unwind: "$application" },
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$application.visaServiceId", "$$serviceId"] },
                  { $eq: ["$status", PaymentStatus.SUCCESS] },
                ],
              },
            },
          },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$amount" },
            },
          },
        ],
        as: "paymentStats",
      },
    },
    {
      $project: {
        _id: 0,
        country: { $ifNull: ["$country.countryName", "Unknown Country"] },
        serviceName: {
          $ifNull: ["$service.title", "$service.name"],
        },
        applications: 1,
        approvalRate: {
          $cond: [
            { $eq: ["$applications", 0] },
            0,
            {
              $round: [
                {
                  $multiply: [
                    { $divide: ["$approvedCount", "$applications"] },
                    100,
                  ],
                },
                2,
              ],
            },
          ],
        },
        revenue: {
          $ifNull: [{ $arrayElemAt: ["$paymentStats.totalRevenue", 0] }, 0],
        },
      },
    },
    { $sort: { applications: -1 } },
    { $limit: 5 },
  ]);

  // 7) Manager performance
  const managerPerformance = await VisaApplicationModel.aggregate([
    {
      $match: {
        assignedTo: { $ne: null },
      },
    },
    {
      $group: {
        _id: "$assignedTo",
        applicationsHandled: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "manager",
      },
    },
    {
      $unwind: {
        path: "$manager",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 0,
        managerId: "$manager._id",
        managerName: {
          $ifNull: ["$manager.full_name", "$manager.name"],
        },
        applicationsHandled: 1,
      },
    },
    { $sort: { applicationsHandled: -1 } },
    { $limit: 5 },
  ]);

  return {
    summary: {
      newUsers: {
        value: currentUsers,
        growth: newUsersGrowth,
      },
      totalRevenue: {
        value: Number(
          totalRevenue.toFixed ? totalRevenue.toFixed(2) : totalRevenue,
        ),
        growth: revenueGrowth,
      },
      averageProcessingTimeDays: {
        value: averageProcessingTimeDays,
      },
    },
    paymentTrend,
    applicationStatus,
    topServicesCountries,
    managerPerformance,
  };
};
const getAdminOverview = async () => {
  const [
    totalClients,
    totalApplications,
    totalCountries,
    pendingPayments,
    recentActivitiesRaw,
  ] = await Promise.all([
    User.countDocuments({ role: Role.USER }),
    VisaApplicationModel.countDocuments(),
    CountryModel.countDocuments(),
    VisaApplicationPaymentModel.countDocuments({ status: "PENDING" }),
    ActivityLog.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("actorId", "full_name name role"),
  ]);

  const recentActivities = recentActivitiesRaw.map((item: any) => ({
    _id: item._id,
    actorName:
      item?.actorId?.full_name || item?.actorId?.name || "Unknown User",
    action: item.action,
    entityType: item.entityType,
    message: item.message || "",
    status: item.status,
    createdAt: item.createdAt,
  }));

  return {
    cards: {
      totalClients,
      totalApplications,
      totalCountries,
      pendingPayments,
    },
    recentActivities,
  };
};

export const DashboardService = {
  getAdminOverview,
  getAnalytics,
};
