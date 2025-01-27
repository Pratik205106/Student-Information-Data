// Get references to form and table elements
const studentForm = document.getElementById('studentForm');
const studentTableBody = document.querySelector('#studentTable tbody');
const searchInput = document.getElementById('searchInput');

// Load students from localStorage or initialize an empty array
let students = JSON.parse(localStorage.getItem('students')) || [];

// Populate the table with saved students
students.forEach(addStudentToTable);

// Event listener for form submission
studentForm.addEventListener('submit', handleFormSubmit);
searchInput.addEventListener('input', handleSearch);

/**
 * Handles form submission for adding or editing a student
 */
function handleFormSubmit(event) {
  event.preventDefault();

  const formData = new FormData(studentForm);
  const student = Object.fromEntries(formData.entries());

  const isEditing = studentForm.dataset.editingIndex !== undefined;

  if (isEditing) {
    const index = parseInt(studentForm.dataset.editingIndex, 10);
    updateStudent(index, student);
  } else {
    addStudent(student);
  }

  saveToLocalStorage();
  studentForm.reset();
  delete studentForm.dataset.editingIndex; // Clear editing state
}

/**
 * Saves the students array to localStorage
 */
function saveToLocalStorage() {
  localStorage.setItem('students', JSON.stringify(students));
  console.log('Students JSON saved:', JSON.stringify(students, null, 2));
}

/**
 * Adds a student to the data array and table
 */
function addStudent(student) {
  students.push(student);
  addStudentToTable(student);
}

/**
 * Updates a student's data and table row
 */
function updateStudent(index, updatedStudent) {
  students[index] = updatedStudent;
  updateTableRow(index, updatedStudent);
}

/**
 * Adds a new student row to the table
 */
function addStudentToTable(student) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td class="px-6 py-4 text-sm text-gray-700 font-medium border-b border-gray-200">${student.firstName}</td>
    <td class="px-6 py-4 text-sm text-gray-700 font-medium border-b border-gray-200">${student.lastName}</td>
    <td class="px-6 py-4 text-sm text-gray-700 font-medium border-b border-gray-200">${student.gender}</td>
    <td class="px-6 py-4 text-sm text-gray-700 font-medium border-b border-gray-200">${student.dob}</td>
    <td class="px-6 py-4 text-sm text-gray-700 font-medium border-b border-gray-200">${student.class}</td>
    <td class="px-6 py-4 text-sm text-gray-700 font-medium border-b border-gray-200">${student.rollNo}</td>
    <td class="px-6 py-4 text-sm text-gray-700 font-medium border-b border-gray-200">${student.fatherName}</td>
    <td class="px-6 py-4 text-sm text-gray-700 font-medium border-b border-gray-200">${student.motherName}</td>
    <td class="px-6 py-4 text-sm text-gray-700 font-medium border-b border-gray-200">${student.address}</td>
    <td class="px-6 py-4 text-sm text-gray-700 font-medium border-b border-gray-200">${student.contact}</td>
    <td class="px-6 py-4 text-center border-b border-gray-200">
      <div class="flex justify-center space-x-2">
        <button 
          class="text-sm bg-blue-500 text-white px-3 py-1 rounded-md shadow-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-300" 
          onclick="editStudent(this)">
          Edit
        </button>
        <button 
          class="text-sm bg-red-500 text-white px-3 py-1 rounded-md shadow-md hover:bg-red-600 focus:ring-2 focus:ring-red-300" 
          onclick="deleteStudent(this)">
          Delete
        </button>
        <button 
          class="text-sm bg-yellow-500 text-white px-3 py-1 rounded-md shadow-md hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-300" 
          onclick="viewDetails(this)">
          View
        </button>
      </div>
    </td>
  `;
  studentTableBody.appendChild(row);
}

/**
 * Updates an existing row in the table
 */
function updateTableRow(index, student) {
  const row = studentTableBody.children[index];
  const cells = row.querySelectorAll('td');
  Object.values(student).forEach((value, idx) => {
    cells[idx].textContent = value;
  });
}

/**
 * Edits a student's data
 */
function editStudent(button) {
  const row = button.closest('tr');
  const index = Array.from(studentTableBody.children).indexOf(row);
  const student = students[index];

  Object.entries(student).forEach(([key, value]) => {
    const input = studentForm.elements[key];
    if (input) input.value = value;
  });

  studentForm.dataset.editingIndex = index;
}

/**
 * Deletes a student from the data array and table
 */
function deleteStudent(button) {
  const row = button.closest('tr');
  const index = Array.from(studentTableBody.children).indexOf(row);

  students.splice(index, 1);
  row.remove();

  saveToLocalStorage();
  console.log('Students JSON after deletion:', JSON.stringify(students, null, 2));
}

/**
 * Views details of a student (can be customized for modal or other UI)
 */
function viewDetails(button) {
  const row = button.closest('tr');
  const index = Array.from(studentTableBody.children).indexOf(row);
  const student = students[index];

  // Create a modal to display the student's details
  const modalHTML = `
    <div class="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white p-8 rounded-lg shadow-lg w-1/2">
        <h2 class="text-2xl font-bold text-center mb-6 text-blue-700">Student Details</h2>
        <div class="space-y-4">
          <div><strong>First Name:</strong> ${student.firstName}</div>
          <div><strong>Last Name:</strong> ${student.lastName}</div>
          <div><strong>Gender:</strong> ${student.gender}</div>
          <div><strong>Date of Birth:</strong> ${student.dob}</div>
          <div><strong>Class:</strong> ${student.class}</div>
          <div><strong>Roll No:</strong> ${student.rollNo}</div>
          <div><strong>Father's Name:</strong> ${student.fatherName}</div>
          <div><strong>Mother's Name:</strong> ${student.motherName}</div>
          <div><strong>Address:</strong> ${student.address}</div>
          <div><strong>Contact:</strong> ${student.contact}</div>
        </div>
        <div class="mt-6 text-center">
          <button onclick="closeModal()" class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">Close</button>
        </div>
      </div>
    </div>
  `;

  // Add the modal to the body
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

/**
 * Closes the modal when the close button is clicked
 */
function closeModal() {
  const modal = document.querySelector('.fixed');
  if (modal) {
    modal.remove();
  }
}

/**
 * Handles the search functionality
 */
function handleSearch(event) {
  const query = event.target.value.toLowerCase();
  const filteredStudents = students.filter(student => {
    return Object.values(student).some(value => 
      value.toLowerCase().includes(query)
    );
  });

  // Clear current table rows
  studentTableBody.innerHTML = '';

  // Add filtered students to the table
  filteredStudents.forEach(addStudentToTable);
}
