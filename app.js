const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let students = [
  { id: 1, name: "Іван Петренко", age: 20, grade: 85.5, faculty: "IT" },
  { id: 2, name: "Марія Коваль", age: 19, grade: 92.3, faculty: "Економіка" },
  { id: 3, name: "Олег Шевченко", age: 21, grade: 78.4, faculty: "IT" },
  { id: 4, name: "Анна Мельник", age: 18, grade: 88.9, faculty: "Право" },
];

let nextId = 5;

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

function showStudents(list = students) {
  if (list.length === 0) {
    console.log("Список студентів порожній.");
    return;
  }

  console.table(list);
}

function validateStudent(name, age, grade, faculty) {
  if (!name.trim()) return "Ім'я не може бути порожнім.";
  if (isNaN(age) || age < 16 || age > 100) return "Вік має бути числом від 16 до 100.";
  if (isNaN(grade) || grade < 0 || grade > 100) return "Середній бал має бути від 0 до 100.";
  if (!faculty.trim()) return "Факультет не може бути порожнім.";

  return null;
}

async function addStudent() {
  const name = await ask("Введіть ім'я студента: ");
  const age = Number(await ask("Введіть вік студента: "));
  const grade = Number(await ask("Введіть середній бал студента: "));
  const faculty = await ask("Введіть факультет: ");

  const error = validateStudent(name, age, grade, faculty);

  if (error) {
    console.log("Помилка:", error);
    return;
  }

  const newStudent = {
    id: nextId++,
    name: name.trim(),
    age,
    grade,
    faculty: faculty.trim(),
  };

  students.push(newStudent);
  console.log("Студента успішно додано.");
}

async function filterStudents() {
  console.log("\nФільтрація:");
  console.log("1. За віком");
  console.log("2. За мінімальним балом");
  console.log("3. За факультетом");

  const choice = await ask("Оберіть критерій: ");

  let result = [];

  if (choice === "1") {
    const age = Number(await ask("Введіть вік: "));
    result = students.filter((student) => student.age === age);
  } else if (choice === "2") {
    const grade = Number(await ask("Введіть мінімальний бал: "));
    result = students.filter((student) => student.grade >= grade);
  } else if (choice === "3") {
    const faculty = await ask("Введіть факультет: ");
    result = students.filter(
      (student) => student.faculty.toLowerCase() === faculty.toLowerCase()
    );
  } else {
    console.log("Невірний вибір.");
    return;
  }

  showStudents(result);
}

async function sortStudents() {
  console.log("\nСортування:");
  console.log("1. За ім'ям");
  console.log("2. За віком");
  console.log("3. За середнім балом");

  const choice = await ask("Оберіть критерій: ");

  let sortedStudents = [...students];

  if (choice === "1") {
    sortedStudents.sort((a, b) => a.name.localeCompare(b.name));
  } else if (choice === "2") {
    sortedStudents.sort((a, b) => a.age - b.age);
  } else if (choice === "3") {
    sortedStudents.sort((a, b) => b.grade - a.grade);
  } else {
    console.log("Невірний вибір.");
    return;
  }

  showStudents(sortedStudents);
}

function showStatistics() {
  if (students.length === 0) {
    console.log("Немає студентів для статистики.");
    return;
  }

  const averageGrade =
    students.reduce((sum, student) => sum + student.grade, 0) / students.length;

  const bestStudent = students.reduce((best, student) =>
    student.grade > best.grade ? student : best
  );

  const facultyDistribution = students.reduce((result, student) => {
    result[student.faculty] = (result[student.faculty] || 0) + 1;
    return result;
  }, {});

  console.log("\nСтатистика:");
  console.log(`Середній бал усіх студентів: ${averageGrade.toFixed(2)}`);
  console.log("Найкращий студент:");
  console.table([bestStudent]);
  console.log("Розподіл за факультетами:");
  console.table(facultyDistribution);
}

async function findStudentByName() {
  const name = await ask("Введіть ім'я або частину імені студента: ");

  const student = students.find((student) =>
    student.name.toLowerCase().includes(name.toLowerCase())
  );

  if (student) {
    console.log("Студента знайдено:");
    console.table([student]);
  } else {
    console.log("Студента з таким ім'ям не знайдено.");
  }
}

function showMenu() {
  console.log("\n===== Система управління студентами =====");
  console.log("1. Показати всіх студентів");
  console.log("2. Додати студента");
  console.log("3. Фільтрувати студентів");
  console.log("4. Сортувати студентів");
  console.log("5. Показати статистику");
  console.log("6. Знайти студента за ім'ям");
  console.log("0. Вийти");
}

async function main() {
  let isRunning = true;

  while (isRunning) {
    showMenu();

    const choice = await ask("Оберіть дію: ");

    switch (choice) {
      case "1":
        showStudents();
        break;
      case "2":
        await addStudent();
        break;
      case "3":
        await filterStudents();
        break;
      case "4":
        await sortStudents();
        break;
      case "5":
        showStatistics();
        break;
      case "6":
        await findStudentByName();
        break;
      case "0":
        console.log("Роботу програми завершено.");
        isRunning = false;
        rl.close();
        break;
      default:
        console.log("Невірний вибір. Спробуйте ще раз.");
    }
  }
}

main();