import { Link } from "react-router-dom";
import { Dropdown } from "../../components";
import { deleteExercise } from "../../services/course/exercise";

const Assignment = ({
  exercise,
  onDelete,
  onEdit,
  exerciseId,
  onChangeExercise,
}) => {
  if (!exercise) {
    return null;
  }
  //turn deadline from api to readable date
  const convertDate = (timestamp) => {
    const date = new Date(timestamp);

    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();
    const hour = date.getHours();

    const formattedDate = `${month} ${year} ${hour}:00`;

    return formattedDate;
  };
  const link = "/exercise/" + exerciseId;
  const deadline = convertDate(exercise.deadline);
  const handleDelete = async () => {
    deleteExercise(exerciseId)
      .then(() => {
        // Handle successful deletion of course content
        alert("Exercise deleted successfully.");
        onChangeExercise();
      })
      .catch((error) => {
        // Handle error during course content deletion
        alert("Error deleting exercise:" + error);
      });
  };
  return (
    <div class="w-full h-fit text-[#1B1C1E] divide-y divide-[#808080]/30 text-3xl">
      <div class="flex flex-row justify-between px-2.5 py-2">
        <Link to={link}>
          <button class="flex flex-row place-items-center space-x-10 hover:text-bold hover:text-[#560319] hover:underline ">
            <img
              class="w-10 h-10"
              src="/Assignment/AssignmentIcon.png"
              alt=""
            />
            <div class="text-left">
              <p className="text-4xl truncate">{exercise.name}</p>
              <p>{exercise.submission_count} submissions</p>
            </div>
          </button>
        </Link>

        <div class="flex flex-row flex-start space-x-14">
          <p className="mt-2">Due date: {deadline}</p>
          <div>
            <Dropdown onDelete={handleDelete} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assignment;
