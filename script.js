// Get HTML elements

const skillForm = document.getElementById("skillForm");
const skillName = document.getElementById("skillName");
const category = document.getElementById("category");
const progress = document.getElementById("progress");
const progressValue = document.getElementById("progressValue");

const skillList = document.getElementById("skillList");
const search = document.getElementById("search");
const filter = document.getElementById("filter");

const totalSkills = document.getElementById("totalSkills");
const completedSkills = document.getElementById("completedSkills");
const averageProgress = document.getElementById("averageProgress");


// Load skills from Local Storage

let skills = JSON.parse(localStorage.getItem("skills")) || [];


// Display slider value

progress.addEventListener("input", function () {
    progressValue.textContent = progress.value + "%";
});


// Add skill

skillForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const newSkill = {
        id: Date.now(),
        name: skillName.value.trim(),
        category: category.value,
        progress: Number(progress.value)
    };

    skills.push(newSkill);

    saveSkills();

    skillForm.reset();

    progress.value = 0;
    progressValue.textContent = "0%";

    displaySkills();
});


// Save skills

function saveSkills() {
    localStorage.setItem("skills", JSON.stringify(skills));
}


// Display skills

function displaySkills() {

    const searchText = search.value.toLowerCase();
    const selectedCategory = filter.value;

    const filteredSkills = skills.filter(function (skill) {

        const matchesSearch =
            skill.name.toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "All" ||
            skill.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });


    skillList.innerHTML = "";


    if (filteredSkills.length === 0) {

        skillList.innerHTML = `
            <div class="empty">
                <p>No skills found.</p>
            </div>
        `;

        updateDashboard();

        return;
    }


    filteredSkills.forEach(function (skill) {

        const card = document.createElement("div");

        card.className = "skill-card";

        card.innerHTML = `

            <div class="skill-header">

                <div class="skill-name">
                    ${skill.name}
                </div>

                <div class="category">
                    ${skill.category}
                </div>

            </div>


            <div class="progress-container">

                <div class="progress-bar"
                     style="width: ${skill.progress}%">
                </div>

            </div>


            <div class="progress-text">
                Progress: ${skill.progress}%
            </div>


            <div class="actions">

                <button onclick="updateSkill(${skill.id})">
                    Update
                </button>

                <button class="delete-btn"
                        onclick="deleteSkill(${skill.id})">
                    Delete
                </button>

            </div>
        `;


        skillList.appendChild(card);

    });


    updateDashboard();
}


// Delete skill

function deleteSkill(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this skill?");

    if (!confirmDelete) {
        return;
    }

    skills = skills.filter(function (skill) {
        return skill.id !== id;
    });

    saveSkills();

    displaySkills();
}


// Update skill

function updateSkill(id) {

    const skill = skills.find(function (item) {
        return item.id === id;
    });

    if (!skill) {
        return;
    }


    const newProgress = prompt(
        "Enter new progress (0 - 100):",
        skill.progress
    );


    if (newProgress === null) {
        return;
    }


    const value = Number(newProgress);


    if (
        isNaN(value) ||
        value < 0 ||
        value > 100
    ) {

        alert("Please enter a value between 0 and 100.");

        return;
    }


    skill.progress = value;

    saveSkills();

    displaySkills();
}


// Dashboard

function updateDashboard() {

    totalSkills.textContent = skills.length;


    const completed = skills.filter(function (skill) {
        return skill.progress === 100;
    });

    completedSkills.textContent = completed.length;


    if (skills.length === 0) {

        averageProgress.textContent = "0%";

        return;
    }


    const totalProgress = skills.reduce(
        function (total, skill) {
            return total + skill.progress;
        },
        0
    );


    const average =
        Math.round(totalProgress / skills.length);

    averageProgress.textContent =
        average + "%";
}


// Search

search.addEventListener("input", displaySkills);


// Category filter

filter.addEventListener("change", displaySkills);


// Initial display

displaySkills();