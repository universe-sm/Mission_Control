document.addEventListener("DOMContentLoaded", () => {
    const createtask = document.querySelector(".createtask");
    const exit = document.querySelector(".fa-close");
    const menu = document.querySelector(".fa-bars");
    const exit2 = document.querySelector(".exit2");
    const hamburger = document.querySelector(".hamburgermenu");
    const dialogbox = document.querySelector(".dialogbox");
    const main = document.querySelector(".main");
    const createmission = document.querySelector(".createmission");
    const tasks = document.querySelector(".tasks");
    const tasks2 = document.querySelector(".tasks2");
    const missionawaiting = document.querySelector(".tasks .text");
    const missionawaiting2 = document.querySelector(".tasks2 .text");
    const token = localStorage.getItem("token");
    const logout = document.querySelector(".logout");
    const lowfilter = document.querySelector(".priority .low");
    const mediumfilter = document.querySelector(".priority .medium");
    const criticalfilter = document.querySelector(".priority .critical");
    const lowfilter1 = document.querySelector(".priority1 .low");
    const mediumfilter1 = document.querySelector(".priority1 .medium");
    const criticalfilter1 = document.querySelector(".priority1 .critical");
    const low = document.querySelector(".low1");
    const medium = document.querySelector(".medium1");
    const critical = document.querySelector(".high1");
    let priority;
    const launchbutton = document.querySelector(".launch");
    const days = document.querySelectorAll(".day");
    const month = document.querySelector(".month");
    let monthname = month.value;
    let paddedmonth;
    const clear = document.querySelector(".priority .clearfilter");
    const clear2 = document.querySelector(".priority1 .clearfilter");
    let selecteddate = null;
    const pie1 = document.querySelector(".pie1");
    const pie2 = document.querySelector(".pie2");
    const progresslabel = document.querySelector(".progresslabel");
    const search = document.querySelector(".search1");
    const username = document.querySelector(".username");
    const date = document.querySelector(".date");

    //logout
    logout.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "index.html";

    });

    //date 
    date.textContent = "Date: " + new Date().toISOString().split("T")[0];
    //username
    const getusername = async () => {
        const response = await fetch("https://mission-control-t8qt.onrender.com/users/getuser", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();
        if (response.ok) {
            username.textContent = data.user.username;
        }

    };
    getusername();

    //task-card
    const rendertask = (task) => {
        const taskcard = document.createElement("div");

        //checkbox
        const done = document.createElement("div");
        done.classList.add("done");
        const deletetask = document.createElement("i");
        deletetask.classList.add("fa-solid", "fa-xmark");
        const checkbox2 = document.createElement("input");
        checkbox2.type = "checkbox";
        checkbox2.classList.add("done-checkbox");
        checkbox2.checked = task.status === "completed";
        const today = new Date().toISOString().split("T")[0];
        const taskdate = task.creationdate.split("T")[0];

        done.appendChild(deletetask);
        done.appendChild(checkbox2);
        taskcard.appendChild(done);

        //taskdetails
        const taskdetails = document.createElement("div");
        taskdetails.classList.add("task-details");


        //tasktitle
        const tasktitle = document.createElement("div");
        tasktitle.textContent = task.title;
        tasktitle.classList.add("task-title");
        const taskpriority = document.createElement("div");
        taskpriority.textContent = task.priority;
        if (taskpriority.textContent == "low") {
            taskpriority.classList.add("task-priority");
            taskpriority.classList.add("low");
            taskcard.classList.add("task-card");
            taskcard.classList.add("task-low");

        }
        else if (taskpriority.textContent == "medium") {
            taskpriority.classList.add("task-priority");
            taskpriority.classList.add("medium");
            taskcard.classList.add("task-card");
            taskcard.classList.add("task-medium");
        }
        else {
            taskpriority.classList.add("task-priority");
            taskpriority.classList.add("critical");
            taskcard.classList.add("task-card");
            taskcard.classList.add("task-critical");
        }
        tasktitle.appendChild(taskpriority);
        taskdetails.appendChild(tasktitle);


        //taskdescriptions
        const taskdescription = document.createElement("div");
        taskdescription.textContent = task.description;
        taskdescription.classList.add("task-description");
        taskdetails.appendChild(taskdescription);
        taskdetails.addEventListener("click", () => {
            taskdescription.classList.toggle("show");
        });
        taskcard.appendChild(taskdetails);

        //delete task
        deletetask.addEventListener("click", async () => {
            const response = await fetch(`https://mission-control-t8qt.onrender.com/tasks/delete/${task._id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (response.ok) {
                alert("Task Deleted");
                taskcard.remove();
                if (tasks.querySelectorAll(".task-card").length === 0) {
                    missionawaiting.style.display = "flex";
                }
            }
        });

        //checkbox
        checkbox2.addEventListener("change", async () => {
            const newstattus = checkbox2.checked ? "completed" : "pending";
            const response = await fetch(`https://mission-control-t8qt.onrender.com/tasks/update/${task._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ status: newstattus })

            });

            const data = await response.json();
            if (response.ok) {
                taskcard.setAttribute("data-status", newstattus);
                updateprogress();
                updateefficiency();
            }
        })
        taskcard.setAttribute("data-status", task.status);
        taskcard.setAttribute("data-date", task.creationdate.split("T")[0]);
        if (taskdate !== today) {
            checkbox2.disabled = true;
            if (taskcard.dataset.status === "pending") {
                taskcard.style.borderColor = "rgba(235, 35, 35, 0.45)";
            }
        }
        return taskcard;

    }
    //loadtasks
    const loadtasks = async () => {
        const response = await fetch("https://mission-control-t8qt.onrender.com/tasks/getall", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();
        if (response.ok) {
            if (data.length != 0) {
                missionawaiting.style.display = "none";
                missionawaiting2.style.display = "none";
                data.forEach((task) => {
                    tasks.appendChild(rendertask(task));
                    //formobile
                    tasks2.appendChild(rendertask(task));
                });
            }

            updateprogress();
            updateefficiency();
        }

        else {
            alert(data.error);
            if (data.error === "Invalid or expired token! Login again") {
                window.location.href = "login.html";
            }
        }
    };



    //updateprogress
    const updateprogress = () => {
        const allcards = document.querySelectorAll(".tasks .task-card");
        let total = 0;
        let completed = 0;
        allcards.forEach((card) => {
            if (card.style.display !== "none") {
                total++;
                if (card.dataset.status == "completed") {
                    completed++;
                }
            }
        });
        const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
        pie1.style.background = `conic-gradient( #b8a4f0  0% ${percentage}%, #ffffff ${percentage}% 100%)`;
        pie2.textContent = `${percentage}%`;
        progresslabel.textContent = "Your Overall Progress";
    };
    //update efficency
    const updateefficiency = () => {
        const allcards = document.querySelectorAll(".tasks .task-card");
        let total = 0;
        let completed = 0;
        allcards.forEach((card) => {
            total++;
            if (card.dataset.status == "completed") {
                completed++;
            }
        });
        const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
        const efficiencybox = document.querySelector(".efficiency");
        efficiencybox.textContent = `Efficiency_Rate: ${percentage}%`;
    };

    loadtasks();

    //adding tasks
    createtask.addEventListener("click", () => {
        dialogbox.style.display = "block";
        main.style.filter = "blur(6px)";
    });
    createmission.addEventListener("click", () => {
        dialogbox.style.display = "block";
        main.style.filter = "blur(6px)";
        hamburger.style.display = "none";
    });
    exit.addEventListener("click", () => {
        dialogbox.style.display = "none";
        main.style.filter = "blur(0px)";
    });
    menu.addEventListener("click", () => {
        hamburger.style.display = "flex";
    });
    exit2.addEventListener("click", () => {
        hamburger.style.display = "none";
    });

    low.addEventListener("click", () => {
        medium.style.background = "#171717";
       medium.style.borderColor = " #2a2a45";
        critical.style.background = "#171717";
        critical.style.borderColor = " #2a2a45";
        low.style.background = "rgba(34, 211, 238, 0.15)";
        low.style.borderColor = "#7dd3fc";
        priority = "low";
    });
    medium.addEventListener("click", () => {
        low.style.background = "#171717";
        low.style.borderColor = " #2a2a45";
        critical.style.background = "#171717";
        critical.style.borderColor = " #2a2a45";
        medium.style.background = "rgba(167, 139, 250, 0.15)";
        medium.style.borderColor = " #a88ef0";

        priority = "medium";
    });
    critical.addEventListener("click", () => {
        medium.style.background = "#171717";
        medium.style.borderColor = " #2a2a45";
        low.style.background = "#171717";
        low.style.borderColor = " #2a2a45";
        critical.style.background = "rgba(244, 114, 182, 0.15)";
        critical.style.borderColor = " #f472b6";
        priority = "critical";
    });

    //launchbutton
    launchbutton.addEventListener("click", async () => {
        const title = document.querySelector(".title1").value;
        const description = document.querySelector(".textarea").value;

        const response = await fetch("https://mission-control-t8qt.onrender.com/tasks/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ title, description, priority })
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            document.querySelector(".title1").value = "";
            document.querySelector(".textarea").value = "";
            dialogbox.style.display = "none";
            main.style.filter = "blur(0px)";
            missionawaiting.style.display = "none";
            tasks.appendChild(rendertask(data.task));
            tasks2.appendChild(rendertask(data.task));
            updateprogress();
            updateefficiency();
        }
        else {
            alert(data.error);
        }

    });


    //sortingaccordingtocalender
    //month
    month.addEventListener("change", () => {
        days.forEach((d) => {
            d.style.background = "rgba(255, 255, 255, 0.03)";
        });
        monthname = month.value;
        if (monthname == "None") {
            selecteddate = null;
            const allcards = document.querySelectorAll(".task-card");
            allcards.forEach((card) => {
                card.style.display = "flex";
            });
            document.querySelector(".tasks .NotFound").style.display = "none";
            document.querySelector(".tasks2 .NotFound").style.display = "none";
            updateprogress();
            return;
        }
        const monthsarr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const monthindex = monthsarr.indexOf(monthname);
        const monthnumber = monthindex + 1;
        paddedmonth = String(monthnumber).padStart(2, '0');
    });

    //days
    days.forEach((day) => {
        day.addEventListener("click", () => {
            const dayday = day.textContent;
            const monthname = document.querySelector(".month").value;
            days.forEach((d) => {
                d.style.background = "rgba(255, 255, 255, 0.03)";
            });
            if (monthname == "None") {
                selecteddate = null;
                const allcards = document.querySelectorAll(".task-card");
                allcards.forEach((card) => {
                    card.style.display = "flex";
                })
                document.querySelector(".NotFound").style.display = "none";
                document.querySelector(".tasks2 .NotFound").style.display = "none";
                return;
            }
            day.style.background = "rgba(199, 150, 231, 0.71)";
            const year = new Date().getFullYear();
            const paddedday = dayday.padStart(2, '0');
            selecteddate = `${year}-${paddedmonth}-${paddedday}`;
            let matchcount = 0;
            const allcards = document.querySelectorAll(".task-card");
            allcards.forEach((card) => {
                if (card.dataset.date === selecteddate) {
                    card.style.display = "flex";
                    matchcount++;
                }
                else {
                    card.style.display = "none";
                }

            });
            updateprogress();
            if (matchcount == 0) {
                const notfound = document.querySelector(" .tasks .NotFound");
                const notfound2 = document.querySelector(".tasks2 .NotFound");
                notfound.style.display = "flex";
                notfound2.style.display = "flex";
            }
            else {
                const notfound = document.querySelector(".NotFound");
                const notfound2 = document.querySelector(".tasks2 .NotFound");
                notfound.style.display = "none";
                notfound2.style.display = "none";

            }

        })
    });


    //sortaccordingtopriority
    //low
    lowfilter.addEventListener("click", () => {
        let matchcount = 0;
        const allcards = document.querySelectorAll(".task-card");
        allcards.forEach((card) => {
            const isLow = card.classList.contains("task-low");
            const matchesDate = selecteddate ? card.dataset.date === selecteddate : true;

            if (isLow && matchesDate) {
                card.style.display = "flex";
                matchcount++;
            } else {
                card.style.display = "none";
            }

        });
        updateprogress();
        if (matchcount == 0) {
            const notfound = document.querySelector(" .tasks .NotFound");
            notfound.style.display = "flex";
        }
        else {
            const notfound = document.querySelector(".tasks .NotFound");
            notfound.style.display = "none";
        }

    });

    //for mobile
    lowfilter1.addEventListener("click", () => {
        let matchcount = 0;
        const allcards = document.querySelectorAll(".task-card");
        allcards.forEach((card) => {
            const isLow = card.classList.contains("task-low");
            const matchesDate = selecteddate ? card.dataset.date === selecteddate : true;

            if (isLow && matchesDate) {
                card.style.display = "flex";
                matchcount++;
            } else {
                card.style.display = "none";
            }
        });
        updateprogress();
        if (matchcount == 0) {
            const notfound2 = document.querySelector(".tasks2 .NotFound");
            notfound2.style.display = "flex";
        }
        else {
            const notfound2 = document.querySelector(".tasks2 .NotFound");
            notfound2.style.display = "none";

        }

    });


    //sortaccordingtopriority
    //medium
    mediumfilter.addEventListener("click", () => {
        let matchcount = 0;
        const allcards = document.querySelectorAll(".task-card");
        allcards.forEach((card) => {
            const isMedium = card.classList.contains("task-medium");
            const matchesDate = selecteddate ? card.dataset.date === selecteddate : true;

            if (isMedium && matchesDate) {
                card.style.display = "flex";
                matchcount++;
            } else {
                card.style.display = "none";
            }

        });
        updateprogress();
        if (matchcount == 0) {
            const notfound = document.querySelector(" .tasks .NotFound");
            notfound.style.display = "flex";
        }
        else {
            const notfound = document.querySelector(".tasks .NotFound");
            notfound.style.display = "none";
        }

    });

    //for mobile
    mediumfilter1.addEventListener("click", () => {
        let matchcount = 0;
        const allcards = document.querySelectorAll(".task-card");
        allcards.forEach((card) => {
            const isMedium = card.classList.contains("task-medium");
            const matchesDate = selecteddate ? card.dataset.date === selecteddate : true;

            if (isMedium && matchesDate) {
                card.style.display = "flex";
                matchcount++;
            } else {
                card.style.display = "none";
            }

        });
        updateprogress();
        if (matchcount == 0) {
            const notfound2 = document.querySelector(".tasks2 .NotFound");
            notfound2.style.display = "flex";
        }
        else {
            const notfound2 = document.querySelector(".tasks2 .NotFound");
            notfound2.style.display = "none";

        }
    });

    //sortaccordingtopriority
    //critical
    criticalfilter.addEventListener("click", () => {
        let matchcount = 0;
        const allcards = document.querySelectorAll(".task-card");
        allcards.forEach((card) => {
            const isCritical = card.classList.contains("task-critical");
            const matchesDate = selecteddate ? card.dataset.date === selecteddate : true;

            if (isCritical && matchesDate) {
                card.style.display = "flex";
                matchcount++;
            } else {
                card.style.display = "none";
            }
        });
        updateprogress();
        if (matchcount == 0) {
            const notfound = document.querySelector(" .tasks .NotFound");
            notfound.style.display = "flex";
        }
        else {
            const notfound = document.querySelector(".tasks .NotFound");
            notfound.style.display = "none";
        }

    });

    //for mobile
    criticalfilter1.addEventListener("click", () => {
        let matchcount = 0;
        const allcards = document.querySelectorAll(".task-card");
        allcards.forEach((card) => {
            const isCritical = card.classList.contains("task-critical");
            const matchesDate = selecteddate ? card.dataset.date === selecteddate : true;

            if (isCritical && matchesDate) {
                card.style.display = "flex";
                matchcount++;
            } else {
                card.style.display = "none";
            }

        });
        updateprogress();
        if (matchcount == 0) {
            const notfound2 = document.querySelector(".tasks2 .NotFound");
            notfound2.style.display = "flex";
        }
        else {
            const notfound2 = document.querySelector(".tasks2 .NotFound");
            notfound2.style.display = "none";

        }
    });


    //clear priority filters
    clear.addEventListener("click", () => {
        const allcards = document.querySelectorAll(".tasks .task-card");
        allcards.forEach((card) => {
            const matchesDate = selecteddate ? card.dataset.date === selecteddate : true;
            if (matchesDate) {
                card.style.display = "flex";
            } else {
                card.style.display = "none";
            }

        });
        updateprogress();
        document.querySelector(".tasks .NotFound").style.display = "none";
    });

    clear2.addEventListener("click", () => {
        const allcards = document.querySelectorAll(".tasks2 .task-card");
        allcards.forEach((card) => {
            const matchesDate = selecteddate ? card.dataset.date === selecteddate : true;
            if (matchesDate) {
                card.style.display = "flex";
            } else {
                card.style.display = "none";
            }

        });
        updateprogress();
        document.querySelector(".tasks2 .NotFound").style.display = "none";
    });


    //search bar
    search.addEventListener("input", () => {
        let matchcount = 0;
        const allcards = document.querySelectorAll(".tasks .task-card");
        allcards.forEach((card) => {
            month.value = "None";
            days.forEach((d) => {
                d.style.background = "rgba(255, 255, 255, 0.03)";
            });

            selecteddate = null;
            const tasktitle = card.querySelector(".task-title");
            if (tasktitle.textContent.toLowerCase().includes(search.value.toLowerCase())) {
                card.style.display = "flex";
                matchcount++;
            }
            else {
                card.style.display = "none";
            }

        });

        updateprogress();
        if (matchcount == 0) {
            const notfound = document.querySelector(" .tasks .NotFound");
            const notfound2 = document.querySelector(".tasks2 .NotFound");
            notfound.style.display = "flex";
            notfound2.style.display = "flex";
        }
        else {
            const notfound = document.querySelector(".NotFound");
            const notfound2 = document.querySelector(".tasks2 .NotFound");
            notfound.style.display = "none";
            notfound2.style.display = "none";

        }

    });
})