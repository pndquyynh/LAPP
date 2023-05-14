const CoursecardTeacher = ({ course }) => {
  return (
    <div class="card">
      <div class="flex flex-col bg-[#EC9A86]/80 rounded-3xl h-64 w-[300px] shadow-xl place-items-center">
        <img
          class="w-[300px] h-[154px] rounded-t-3xl rounded-b-none"
          src={course.picture || "/Coursecard_img/CourseTePic.png"}
          alt="Course"
        />

        <div class="flex flex-col container">
          <h1 class="text-3xl font-bold truncate dark:text-[#1b1c1e] ml-4">
            {course.name}
          </h1>

          <div class="flex flex-row text-2xl ml-4">
            <img
              class="w-5 h-5"
              src="/Coursecard_img/human.png"
              alt="Participants: "
            />
            <p class="text-center ml-2 dark:text-[#1b1c1e] truncate">
              {course.participant_count}
            </p>
          </div>

          <div class="flex flex-row text-2xl ml-4">
            <img
              class="w-5 h-5"
              src="/Coursecard_img/Icon.png"
              alt="Semester: "
            />
            <p class="ml-2 dark:text-[#1b1c1e] truncate">
              {course.semester || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursecardTeacher;
