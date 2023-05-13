const ExerciseSection = ({ exercise }) => {
  const convertDate = (timestamp) => {
    const date = new Date(timestamp);

    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();
    const hour = date.getHours();

    const formattedDate = `${month} ${year} ${hour}:00`;

    return formattedDate;
  };
  const deadline = convertDate(exercise.deadline);
  return (
    <div>
      <div class="flex flex-row border-4 border-[#5C0120] rounded-2xl text-[#1B1C1E] font-dongle not-italic items-center justify-between px-9 py-5 mt-4 w-full h-fit cursor-pointer hover:bg-[#B02B3B] hover:text-[#F1E0CE]">
        <div class="flex flex-row justify-between space-x-11 items-center">
          <img
            src="/ExerciseSection/upload-file.png"
            alt="upload file"
            loading="lazy"
          />
          <p class="font-bold text-4xl">{exercise.name}</p>
        </div>
        <div class="flex flex-row justify-between space-x-14">
          <p class="font-normal text-[25px]">Due: {deadline}</p>
          <img
            src={
              exercise.submitted === true
                ? "/ExerciseSection/tick-image.png"
                : "/ExerciseSection/untick-image.png"
            }
            alt="tick"
            loading="lazy"
          />
          {/* <p class="font-normal text-[25px] w-16 text-right">
            {grade === "null" ? (
              "N/A"
            ) : (
              <span
                style={{
                  width: "4rem",
                  display: "inline-block",
                  textAlign: "right",
                }}
              >
                {grade}
              </span>
            )}
          </p> */}
        </div>
      </div>
    </div>
  );
};
export default ExerciseSection;
