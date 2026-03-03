import { VisaApplicationModel } from "./visa.model";
import { ApplicationStatus, IVisaApplication } from "./visa.interface";

const create = (payload: IVisaApplication) => VisaApplicationModel.create(payload);

const findById = (id: string) => VisaApplicationModel.findById(id);

const findByUserId = (userId: string) => VisaApplicationModel.find({ userId });

const findAll = () => VisaApplicationModel.find();

const updateById = (id: string, payload: Partial<IVisaApplication>) =>
  VisaApplicationModel.findByIdAndUpdate(id, payload, { new: true });


const findActiveApplication = async (
  userId: string,
  visaServiceId: string,
) => {
  return VisaApplicationModel.findOne({
    userId,
    visaServiceId,
    status: {
      $nin: [ApplicationStatus.APPROVED, ApplicationStatus.REJECTED],
    },
  });
};

const deleteById = (id: string) => VisaApplicationModel.findByIdAndDelete(id);


const findByIdWithPopulate = (id: string) =>
  VisaApplicationModel.findById(id)
    .populate("assignedTo", "name email role")
    .populate("assignmentHistory.assignedBy", "name email role")
    .populate("assignmentHistory.assignedTo", "name email role");

export const VisaApplicationRepository = {
  create,
  findById,
  findByUserId,
  findAll,
  updateById,
  findActiveApplication,
  deleteById,
  findByIdWithPopulate,
};