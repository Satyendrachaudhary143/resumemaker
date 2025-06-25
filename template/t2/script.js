let imgUrl = "";
const form = document.getElementById("resumeform");
const resumeOutput = document.getElementById("resume-output");
const imageInput = document.getElementById("image");

function FindUrl() {
    let fileReader = new FileReader();
    fileReader.readAsDataURL(imageInput.files[0]);
    fileReader.onload = () => {
        imgUrl = fileReader.result;
        renderResumePreview();
    }
}

function getFormData() {
  const data = {
    name: form.name.value,
    email: form.email.value,
    phone: form.phone.value,
    gender: form.gender.value,
    maritalStatus: form.maritalStatus.value,
    religion: form.religion.value,
    father: form.father.value,
    dateOfBirth: form.dateOfBirth.value,
    address: form.address.value,
    language: form.language.value,
    summary: form.summary.value,
    image: imgUrl,
    education: [],
    skills: [],
    experience: [],
    hobies: []
  };
  form.querySelectorAll('.educationinp1 input').forEach(inp => {
    if(inp.value.trim()) data.education.push(inp.value.trim());
  });
  form.querySelectorAll('.skillinp1 input').forEach(inp => {
    if(inp.value.trim()) data.skills.push(inp.value.trim());
  });
  form.querySelectorAll('.experienceinp1 input').forEach(inp => {
    if(inp.value.trim()) data.experience.push(inp.value.trim());
  });
  form.querySelectorAll('.hobiesinp1 input').forEach(inp => {
    if(inp.value.trim()) data.hobies.push(inp.value.trim());
  });
  return data;
}

function renderResumePreview() {
  const d = getFormData();
  resumeOutput.innerHTML = `
    <div class="pritable">
      <div class="picture">
        ${d.image ? `<img src="${d.image}" alt="img">` : ''}
      </div>
      <div class="intro">
        <h1>RESUME</h1>
        <div class="detailPer">
          <h2>${d.name || ''}</h2>
          <p>${d.phone ? '+91 ' + d.phone : ''}</p>
          <p>${d.email ? 'Email Id: ' + d.email : ''}</p>
        </div>
      </div>
      <div class="objective">
        <h2>OBJECTIVE</h2>
        <p>${d.summary || ''}</p>
      </div>
      <div class="education">
        <h2>EDUCATION</h2>
        <ul>
          ${d.education.map(e => `<li>${e}</li>`).join('')}
        </ul>
      </div>
      <div class="skills">
        <h2>SKILLS</h2>
        <ul>
          ${d.skills.map(s => `<li>${s}</li>`).join('')}
        </ul>
      </div>
      <div class="workExperience">
        <h2>WORK EXPERIENCE</h2>
        <ul>
          ${d.experience.map(e => `<li>${e}</li>`).join('')}
        </ul>
      </div>
      <div class="strengthHobbies">
        <h2>STRENGHTS & HOBBIES</h2>
        <ul>
          ${d.hobies.map(h => `<li>${h}</li>`).join('')}
        </ul>
      </div>
      <div class="personalDetails">
        <h2>PERSONAL DETAILS</h2>
        <div class="per">
          <div class="cd"><p>Father's Name: </p><span>Mr.${d.father || ''}</span></div>
          <div class="cd"><p>Date of Birth: </p><span>${d.dateOfBirth || ''}</span></div>
          <div class="cd"><p>Gender: </p><span>${d.gender || ''}</span></div>
          <div class="cd"><p>Languages Known:</p> <span>${d.language || ''}</span></div>
          <div class="cd"><p>Marital Status:</p> <span>${d.maritalStatus || ''}</span></div>
          <div class="cd"><p>Religion:</p> <span>${d.religion || ''}</span></div>
          <div class="cd"><p>Address:</p> <span>${d.address || ''}</span></div>
        </div>
        <div class="dc">
          <h2>DECLARATION </h2>
          <p>I hereby declare that the information provided above is true to the best of my knowledge and belief.</p>
        </div>
        <div class="cd dt">
          <p>Date ........</p>
          <span>${d.name || ''}</span>
        </div>
      </div>
    </div>
  `;
}

function downloadPDF() {
  const element = document.getElementById("resume-output");
  const name = (form.name.value || 'resume').replace(/\s+/g, '_');
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const filename = `${name}-${randomNum}.pdf`;
  const opt = {
    margin: 0.2,
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 1 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };
  html2pdf().set(opt).from(element).save();
}

form.addEventListener('input', renderResumePreview);
form.addEventListener('change', renderResumePreview);
imageInput.addEventListener('change', FindUrl);
document.querySelector('.dresume').addEventListener('click', downloadPDF);
window.addEventListener('DOMContentLoaded', function() {
  document.getElementById('resume-output').style.display = 'block';
  renderResumePreview();
});
