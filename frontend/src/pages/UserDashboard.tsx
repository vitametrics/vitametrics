import { useAuth } from "../helpers/AuthContext";
import { DashboardNavbar } from "../components/DashboardNavbar";
import { useState, useEffect, Fragment } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import axios from "axios";
import Pagination from "../components/Pagination";

interface project {
  projectId: string;
  projectName: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  userId: string;
  members: string[];
  devices: string[];
}

const UserDashboard = () => {
  const { projects } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showBackDrop, setShowBackDrop] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams({
    createProject: "false",
  });
  const [projectName, setProjectName] = useState("");
  const [debouncedProjectName, setDebouncedProjectName] = useState("");
  const itemsPerPageOptions = [5, 10, 15, 20];

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedProjectName(projectName);
    }, 100);

    console.log(debouncedProjectName);

    return () => {
      clearTimeout(timer);
    };
  }, [projectName]);

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to the first page after changing the number of items per page
  };

  const indexOfLastProject = Math.min(
    currentPage * itemsPerPage,
    projects.length
  );
  const indexOfFirstProject = (currentPage - 1) * itemsPerPage;
  const currentProjects = projects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  const CREATE_PROJECT_ENDPOINT =
    import.meta.env.NODE_ENV === "production"
      ? import.meta.env.VITE_APP_CREATE_PROJECT_ENDPOINT
      : import.meta.env.VITE_APP_CREATE_PROJECT_DEV_ENDPOINT;

  const createProject = searchParams.get("createProject") === "true";

  useEffect(() => {
    if (createProject) setShowBackDrop(createProject);
  }, []);

  const toggleCreateProjectMenu = (show: boolean) => {
    setSearchParams((prev) => {
      prev.set("createProject", show.toString());
      return prev;
    });
    setShowBackDrop(show); // Show or hide backdrop when invite menu is toggled
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/dashboard/project?id=${projectId}&&view=data`);
  };

  const handleCreateProject = async () => {
    try {
      const response = await axios.post(CREATE_PROJECT_ENDPOINT, {
        params: {
          projectName: debouncedProjectName,
        },
        withCredentials: true,
      });

      console.log(response.data);

      toggleCreateProjectMenu(false);
      setProjectName("");
    } catch (error) {
      console.error(error);
    }
  };

  const renderCreateProjectMenu = () => {
    if (!createProject) return null;
    return (
      <motion.div
        variants={fadeInItemVariants}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        ref={ref}
        className={`font-libreFranklinBold opacity-transition ${showBackDrop ? "show" : ""} absolute w-full  p-10 z-20 bg-[#e8e8e8] flex flex-col left-0 md:left-1/2 md:top-1/2 transform-center md:w-[500px] rounded-xl text-primary shadow-lg`}
      >
        <button
          onClick={() => toggleCreateProjectMenu(false)}
          className="item-3 ml-auto"
        ></button>
        <h1 className="text-3xl mb-10 text-center w-full text-primary font-bold">
          Create New Project
        </h1>
        <p className="text-primary"> Enter New Project Name</p>
        <input
          type="text"
          className="p-3 mb-3 rounded-lg border-b-1 text-primary"
          onChange={(e) => setProjectName(e.target.value)}
        />

        <button
          className="bg-tertiary p-4 text-xl w-full rounded-lg text-white font-bold"
          onClick={handleCreateProject}
        >
          Create
        </button>
      </motion.div>
    );
  };

  const fadeInItemVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  };
  const { ref, inView } = useInView({
    threshold: 0.1, // Adjust based on when you want the animation to trigger (1 = fully visible)
    triggerOnce: true, // Ensures the animation only plays once
  });

  return (
    <div className="h-screen bg-lightmodePrimary font-ralewayBold">
      <DashboardNavbar />
      <div className={`backdrop ${showBackDrop ? "show" : ""}`}></div>

      {renderCreateProjectMenu()}
      <div className="p-20 bg-lightmodeSecondary h-full">
        <h1 className="text-4xl mb-5 font-libreFranklin font-bold text-primary">
          Welcome back
        </h1>

        <div className="flex flex-col bg-white rounded-xl shadow-lg font-libreFranklin p-10">
          <div className=" flex flex-col items-center pb-0">
            <span className="text-left text-primary text-2xl mr-auto mb-3 font-bold">
              Projects
            </span>
            <button
              onClick={() => toggleCreateProjectMenu(true)}
              className="p-2 bg-primary text-white rounded-lg mb-5 text-xl w-[150px] mr-auto font-bold"
            >
              New Project
            </button>
            {/* search bar */}
            <input
              type="text"
              placeholder="Search"
              className="p-2 w-[300px] mr-auto border-2 border-gray-200 rounded-lg mb-2"
            />
            <div className="flex flex-row mr-auto gap-2 text-primary mb-3">
              <Fragment>
                {indexOfFirstProject + 1} - {indexOfLastProject} /{" "}
                {projects.length} Results
              </Fragment>
              <span>|</span>
              <span>
                Display
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className=""
                >
                  {itemsPerPageOptions.map((option) => (
                    <option key={option} value={option}>
                      {option} results
                    </option>
                  ))}
                </select>
              </span>
            </div>
          </div>
          <span className="h-[1px] rounded-xl bg-[#d3d7df] w-full"></span>{" "}
          {/*line*/}
          <div className="flex flex-col pt-0 h-full">
            <div
              id="options"
              className="grid grid-cols-4 w-full text-primary items-center font-bold"
            >
              <button className="p-2">NAME</button>
              <button className="p-2">DEVICES</button>
              <button className="p-2">MEMBERS</button>
              <label className="text-center">ACTION</label>
            </div>

            {currentProjects.map((project: project) => (
              <Fragment key={project.projectId}>
                <span className="h-[0.75px] rounded-xl w-full bg-gray-200"></span>
                <div
                  onClick={() => handleProjectClick(project.projectId)}
                  className="grid grid-cols-4 w-full items-center"
                >
                  <label className="text-center"> {project.projectName}</label>
                  <label className="text-center">
                    {project.devices ? project.devices.length : 0}
                  </label>
                  <label className="text-center">
                    {project.members ? project.members.length : 0}
                  </label>
                  <button className="p-2 bg-transparent text-white rounded-lg flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      width="35px"
                      height="35px"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          d="M5 6.77273H9.2M19 6.77273H14.8M9.2 6.77273V5.5C9.2 4.94772 9.64772 4.5 10.2 4.5H13.8C14.3523 4.5 14.8 4.94772 14.8 5.5V6.77273M9.2 6.77273H14.8M6.4 8.59091V15.8636C6.4 17.5778 6.4 18.4349 6.94673 18.9675C7.49347 19.5 8.37342 19.5 10.1333 19.5H13.8667C15.6266 19.5 16.5065 19.5 17.0533 18.9675C17.6 18.4349 17.6 17.5778 17.6 15.8636V8.59091M9.2 10.4091V15.8636M12 10.4091V15.8636M14.8 10.4091V15.8636"
                          stroke="#464455"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>{" "}
                      </g>
                    </svg>
                  </button>
                </div>
              </Fragment>
            ))}
            <span className="h-[0.75px] rounded-xl w-full bg-gray-200"></span>
            <div
              id="pagination"
              className="flex flex-row mt-auto ml-auto items-center"
            >
              <span className="mr-5 text-primary"></span>
              <Pagination
                totalItems={projects.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserDashboard;
