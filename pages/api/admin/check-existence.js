import dbConnect from "../../../lib/mongoose";
import Project from "../../../models/Project";
import FypProject from "../../../models/FypProject";
import User from "../../../models/User";
import mongoose from "mongoose";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id, type = 'project' } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'ID is required' });
  }

  await dbConnect();

  let Model = Project;
  if (type === 'fyp' || type === 'fypproject') {
    Model = FypProject;
  } else if (type === 'user') {
    Model = User;
  }

  let exists = false;
  if (mongoose.isValidObjectId(id)) {
    const item = await Model.findById(id).select('_id').lean();
    if (item) {
        exists = true;
    }
  }
  
  if (!exists) {
      const item = await Model.findOne({ slug: id }).select('_id').lean();
      if (item) {
          exists = true;
      }
  }

  res.status(200).json({ exists });
}
