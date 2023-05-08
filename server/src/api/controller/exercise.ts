import { Exercise, ExerciseType } from "../model/exercise";
import { NextFunction, Response } from "express";
import { AuthRequest } from "./auth";
import {
  Exercise_ErrorType,
  LecturerViewExercise,
  StudentViewExercise,
  exerciseService,
} from "../service/exercise";
import mongoose, { Types } from "mongoose";
import { fileService } from "../service/files";
import { FileType } from "../../utils/types";
const getAllExercises = async (req: AuthRequest, res: Response) => {
  const { id: courseId } = req.params;
  const { role, _id: userId } = req.user!;
  let result:
    | StudentViewExercise
    | LecturerViewExercise
    | Exercise_ErrorType.NOT_FOUND;
  if (role === "lecturer") {
    result = await exerciseService.getLecturerViewExercise(courseId, userId);
  } else {
    result = await exerciseService.getStudentViewExercise(courseId, userId);
  }
  if (result === Exercise_ErrorType.NOT_FOUND) {
    res.status(404).send(`Exercise not found in course ${courseId}`);
    return;
  }
  res.status(200).json(result);
};

const createExercise = async (req: AuthRequest, res: Response) => {
  const { name, deadline, description } = req.body;
  const { id: courseId } = req.params;
  const lecturer = req.user!._id;
  const files = req.files as Express.Multer.File[];
  const filesFilter = files.map((file) => {
    return { name: file.originalname, url: file.filename };
  });
  if (!name) {
    res.status(400).send("Missing name");
    fileService.remove(filesFilter.map((file) => file.url));
    return;
  }
  if (!description) {
    res.status(400).send("Missing description");
    fileService.remove(filesFilter.map((file) => file.url));
    return;
  }
  if (!deadline) {
    res.status(400).send("Missing Deadline");
    fileService.remove(filesFilter.map((file) => file.url));
    return;
  }
  // const result = await
  await exerciseService.create({
    course: new mongoose.Types.ObjectId(courseId),
    deadline,
    description,
    files: filesFilter,
    lecturer,
    name,
  });
  res.sendStatus(200);
};

const getDetail = async (req: AuthRequest, res: Response) => {
  const { id: courseId } = req.params;
  const { role, _id: userId } = req.user!;
  let result;
  if (role === "lecturer") {
    result = await exerciseService.getLecturerViewDetail(courseId, userId);
  } else {
    result = await exerciseService.getStudentViewDetail(courseId, userId);
  }
  if (result === Exercise_ErrorType.NOT_FOUND) {
    res.status(404).send(`Exercise not found in course ${courseId}`);
    return;
  }
  res.status(200).json(result);
};

const editExercise = async (req: AuthRequest, res: Response) => {
  const { remove, name, files, description, deadline } = req.body;
  const { id: exerciseId } = req.params;

  await fileService.remove(remove);
  // delete all files in remove
  let updateFiles = files.filter(
    (file: FileType) => !remove.includes(file.url)
  );
  // if user dont upload new file
  if (!req.files) {
    await exerciseService.update(exerciseId, {
      name,
      description,
      files: updateFiles,
      deadline,
    });
    res.sendStatus(200);
    return;
  }
  const newFiles = (req.files as Express.Multer.File[]).map((file) => {
    return { name: file.originalname, url: file.filename };
  });
  // add new files
  updateFiles = updateFiles.concat(newFiles);
  await exerciseService.update(exerciseId, {
    name,
    description,
    files: updateFiles,
    deadline,
  });
  res.sendStatus(200);
};

const addGrade = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { grade } = req.body;
  const { id: exerciseId, studentId } = req.params;
  if (isNaN(grade)) {
    res.status(404).send("Grade must be a number");
    return;
  }
  const err = await exerciseService.addGrade(
    exerciseId,
    studentId,
    parseInt(grade)
  );
  if (err === Exercise_ErrorType.NOT_FOUND) {
    res.status(404).send("Can not find solution to add grade");
    return;
  }
  res.sendStatus(204);
};

const deleteExercise = () => {};
const verifyAuthorize = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user!.role === "lecturer") {
    res.status(401).send("Unauthorize");
  }
  const studentId = req.user!._id;
  const { id: exerciseId } = req.params;
  const err = await exerciseService.verifyAuthorize(studentId, exerciseId);
  if (err === Exercise_ErrorType.NOT_FOUND) {
    res
      .status(404)
      .send(`Exercise ${exerciseId} not found in student ${studentId}`);
    return;
  }
  next();
};
const createSolution = async (req: AuthRequest, res: Response) => {
  const studentId = req.user!._id;
  const { id: exerciseId } = req.params;
  const files = req.files as Express.Multer.File[];
  if (files.length === 0) {
    res.status(404).send("Missing file");
    return;
  }
  const filesFilter = files.map((file) => {
    return { name: file.originalname, url: file.filename };
  });
  await exerciseService.createSolution(studentId, exerciseId, filesFilter);
  res.sendStatus(201);
};
const verifyOwner = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const lecturerId = req.user!._id;
  const { id: exerciseId } = req.params;
  if (req.user!.role === "student") {
    res.status(401).send("Unauthorize");
    return;
  }
  const err = await exerciseService.verifyOwner(lecturerId, exerciseId);
  if (err === Exercise_ErrorType.NOT_FOUND) {
    res
      .status(401)
      .send(`Can not find exercise ${exerciseId} that ${lecturerId} created`);
    return;
  }
  next();
};
export const exerciseController = {
  verifyAuthorize,
  createSolution,
  getAllExercises,
  createExercise,
  addGrade,
  deleteExercise,
  editExercise,
  getDetail,
  verifyOwner,
};
