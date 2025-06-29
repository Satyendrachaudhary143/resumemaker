// Resume Builder JavaScript

let experienceCount = 0;
let passportCount = 0;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    setupPhotoUpload();
    setupFormValidation();
    updateProgress();
    setupEducationRows();
});

// Initialize form functionality
function initializeForm() {
    // Photo upload functionality
    document.getElementById('photoInput').addEventListener('change', handlePhotoUpload);
    
    // Form submission
    document.getElementById('resumeForm').addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateForm()) {
            generateResume();
        }
    });

    // Real-time progress tracking
    const formInputs = document.querySelectorAll('#resumeForm input, #resumeForm textarea, #resumeForm select');
    formInputs.forEach(input => {
        input.addEventListener('input', updateProgress);
        input.addEventListener('change', updateProgress);
    });
}

// Setup photo upload with drag and drop
function setupPhotoUpload() {
    const photoUpload = document.querySelector('.photo-upload');
    const photoInput = document.getElementById('photoInput');

    // Drag and drop functionality
    photoUpload.addEventListener('dragover', function(e) {
        e.preventDefault();
        photoUpload.classList.add('dragover');
    });

    photoUpload.addEventListener('dragleave', function(e) {
        e.preventDefault();
        photoUpload.classList.remove('dragover');
    });

    photoUpload.addEventListener('drop', function(e) {
        e.preventDefault();
        photoUpload.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            photoInput.files = files;
            handlePhotoUpload();
        }
    });
}

// Handle photo upload
function handlePhotoUpload() {
    const file = document.getElementById('photoInput').files[0];
    if (file) {
        // Validate file type and size
        if (!file.type.startsWith('image/')) {
            showToast('Please select a valid image file', 'error');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            showToast('Image size should be less than 5MB', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('photoPreview');
            preview.src = e.target.result;
            preview.style.display = 'block';
            showToast('Photo uploaded successfully!', 'success');
        };
        reader.readAsDataURL(file);
    }
}

// Setup form validation
function setupFormValidation() {
    const form = document.getElementById('resumeForm');
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name || field.id;
    
    // Remove existing error states
    field.classList.remove('error', 'success');
    
    // Check if field is required
    if (field.hasAttribute('required') && !value) {
        field.classList.add('error');
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            field.classList.add('error');
            return false;
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            field.classList.add('error');
            return false;
        }
    }
    
    // If validation passes
    if (value) {
        field.classList.add('success');
    }
    
    return true;
}

// Validate entire form
function validateForm() {
    const form = document.getElementById('resumeForm');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showToast('Please fill all required fields correctly', 'error');
    }
    
    return isValid;
}

// Update progress bar
function updateProgress() {
    const form = document.getElementById('resumeForm');
    const requiredFields = form.querySelectorAll('[required]');
    const filledFields = Array.from(requiredFields).filter(field => field.value.trim() !== '');
    const progress = (filledFields.length / requiredFields.length) * 100;
    
    const progressFill = document.getElementById('progressFill');
    progressFill.style.width = progress + '%';
}

// Add experience section
function addExperience() {
    experienceCount++;
    const container = document.getElementById('experienceContainer');
    const experienceDiv = document.createElement('div');
    experienceDiv.className = 'experience-item';
    experienceDiv.innerHTML = `
        <button type="button" class="remove-btn" onclick="removeExperience(this)">×</button>
        <div class="grid-2">
            <div class="form-group">
                <label>Job Title</label>
                <input type="text" class="form-control" name="expTitle${experienceCount}" required>
            </div>
            <div class="form-group">
                <label>Company</label>
                <input type="text" class="form-control" name="expCompany${experienceCount}" required>
            </div>
        </div>
        <div class="grid-2">
            <div class="form-group">
                <label>From Date</label>
                <input type="date" class="form-control" name="expFrom${experienceCount}" required>
            </div>
            <div class="form-group">
                <label>To Date</label>
                <input type="date" class="form-control" name="expTo${experienceCount}" required>
            </div>
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea class="form-control" name="expDesc${experienceCount}" rows="3"></textarea>
        </div>
    `;
    container.appendChild(experienceDiv);
    
    // Add validation to new fields
    const newInputs = experienceDiv.querySelectorAll('input, textarea');
    newInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
    
    showToast('Experience section added!', 'success');
}

// Remove experience section
function removeExperience(button) {
    button.parentElement.remove();
    showToast('Experience section removed', 'warning');
}

// Add passport section
function addPassport() {
    passportCount++;
    const container = document.getElementById('passportContainer');
    const passportDiv = document.createElement('div');
    passportDiv.className = 'passport-item';
    passportDiv.innerHTML = `
        <button type="button" class="remove-btn" onclick="removePassport(this)">×</button>
        <div class="grid-2">
            <div class="form-group">
                <label>Passport Number</label>
                <input type="text" class="form-control" name="passportNo${passportCount}" required>
            </div>
            <div class="form-group">
                <label>Place of Issue</label>
                <input type="text" class="form-control" name="passportPlace${passportCount}" required>
            </div>
        </div>
        <div class="grid-2">
            <div class="form-group">
                <label>Date of Issue</label>
                <input type="date" class="form-control" name="passportIssue${passportCount}" required>
            </div>
            <div class="form-group">
                <label>Date of Expiry</label>
                <input type="date" class="form-control" name="passportExpiry${passportCount}" required>
            </div>
        </div>
    `;
    container.appendChild(passportDiv);
    
    // Add validation to new fields
    const newInputs = passportDiv.querySelectorAll('input');
    newInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
    
    showToast('Passport section added!', 'success');
}

// Remove passport section
function removePassport(button) {
    button.parentElement.remove();
    showToast('Passport section removed', 'warning');
}

// Show toast notification
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'exclamation-triangle'}"></i>
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Show loading overlay
function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
}

// Hide loading overlay
function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

// Form submission and resume generation
function generateResume() {
    showLoading();
    
    setTimeout(() => {
        const formData = new FormData(document.getElementById('resumeForm'));
        const data = Object.fromEntries(formData);
        
        // Get all form values
        const resumeData = {
            name: document.getElementById('name').value,
            fatherName: document.getElementById('fatherName').value,
            dob: document.getElementById('dob').value,
            gender: document.getElementById('gender').value,
            nationality: document.getElementById('nationality').value,
            maritalStatus: document.getElementById('maritalStatus').value,
            religion: document.getElementById('religion').value,
            visaStatus: document.getElementById('visaStatus').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            postApplied: document.getElementById('postApplied').value,
            profile: document.getElementById('profile').value,
            languages: document.getElementById('languages').value,
            photo: document.getElementById('photoPreview').src
        };

        // Get experience data
        const experiences = [];
        const experienceItems = document.querySelectorAll('.experience-item');
        experienceItems.forEach((item, index) => {
            const inputs = item.querySelectorAll('input, textarea');
            if (inputs[0].value && inputs[1].value) { // Only add if title and company are filled
                experiences.push({
                    title: inputs[0].value,
                    company: inputs[1].value,
                    fromDate: inputs[2].value,
                    toDate: inputs[3].value,
                    description: inputs[4].value
                });
            }
        });

        // Get passport data
        const passports = [];
        const passportItems = document.querySelectorAll('.passport-item');
        passportItems.forEach((item, index) => {
            const inputs = item.querySelectorAll('input');
            if (inputs[0].value) { // Only add if passport number is filled
                passports.push({
                    number: inputs[0].value,
                    place: inputs[1].value,
                    issueDate: inputs[2].value,
                    expiryDate: inputs[3].value
                });
            }
        });

        // Get education data (dynamic rows, split by comma)
        const eduInputs = document.querySelectorAll('.edu-input');
        let educations = [];
        eduInputs.forEach(input => {
            if (input.value.includes(',')) {
                educations.push(...input.value.split(',').map(e => e.trim()).filter(e => e));
            } else if (input.value.trim()) {
                educations.push(input.value.trim());
            }
        });
        resumeData.educations = educations;

        resumeData.experiences = experiences;
        resumeData.passports = passports;

        // Generate and display resume
        displayResume(resumeData);
        document.getElementById('downloadBtn').style.display = 'inline-block';
        
        hideLoading();
        showToast('Resume generated successfully!', 'success');
        
        // Add success animation to preview
        const previewContainer = document.getElementById('previewContainer');
        previewContainer.classList.add('success-animation');
        setTimeout(() => {
            previewContainer.classList.remove('success-animation');
        }, 600);
        
    }, 1000); // Simulate processing time
}

function displayResume(data) {
    const previewContainer = document.getElementById('previewContainer');
    const postAppliedSection = data.postApplied && data.postApplied.trim() !== '' ? `
        <div style="background: #337a7c; color: #fff; padding: 7px 16px; font-weight: bold; font-size: 1.05rem; letter-spacing: 1px; margin: 5px 0 7px -32px; width: calc(100% + 64px); box-sizing: border-box;">POST APPLIED FOR <span>*${data.postApplied.toUpperCase()}*</span></div>
    ` : '';
    const visaStatusRow = data.visaStatus && data.visaStatus.trim() !== '' ? `
        <tr>
            <td style="padding: 2px 8px 2px 0; vertical-align: top; font-weight: 500; color: #333; width: 170px;">Visa Status</td>
            <td style="padding: 2px 8px 2px 0; vertical-align: top; width: 12px; color: #666; text-align: center; font-weight: 400;">:</td>
            <td style="padding: 2px 8px 2px 0; vertical-align: top;">${data.visaStatus}</td>
        </tr>
    ` : '';
    const resumeHTML = `
        <div class="cv-container" style="background: #fff; border: 4px double #337a7c; max-width: 100%; margin: auto; padding: 0 34px; box-shadow: 0 3px 16px rgba(0, 0, 0, 0.04); font-family: 'Roboto', Arial, sans-serif;">
            <div style="font-family: 'Playfair Display', Times, serif; color: #337a7c; font-size: 2.3rem; text-align: center; font-weight: 700; margin-bottom: 6px;">Curriculum Vitae</div>
            <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 2px; position: relative; gap: 0;">
                <div style="flex: 1; min-width: 0;">
                    <div style="font-weight:700; letter-spacing:0.5px; margin-bottom:5px;">${data.name.toUpperCase()}</div>
                    <div style="font-size:0.98rem; margin-bottom:3px;"><b>India Mob. no.:</b> ${data.phone}</div>
                    <div style="font-size:0.98rem; margin-bottom:3px;"><b>Email:</b> ${data.email}</div>
                </div>
                <div style="width: 110px; min-width: 110px; display: flex; justify-content: flex-end;">
                    ${data.photo && data.photo !== 'data:,' ? `<img src="${data.photo}" alt="Profile Photo" style="width: 100px; height: 115px; background: #e6e6e6; border-radius: 6px; border: 2px solid #bbb; object-fit: cover;">` : ''}
                </div>
            </div>
            ${postAppliedSection}
            <div style="margin-bottom: 15px;">
                <div style="color: #337a7c; font-weight: bold; font-size: 1rem; margin-bottom: 5px;">PROFILE</div>
                <hr style="border: none; border-top: 1.5px solid #a3c7c7; margin: 2px 0 5px 0;">
                <div style="font-size:0.99rem; line-height: 1.4;">${data.profile}</div>
            </div>
            <div style="background: #337a7c; color: #fff; padding: 7px 16px; font-weight: bold; font-size: 1.05rem; letter-spacing: 1px; margin: 5px 0 7px -32px; width: calc(100% + 64px); box-sizing: border-box;">PERSONAL DETAILS</div>
            <table style="width: 100%; border-collapse: collapse; font-size: 0.95rem; margin-bottom: 15px;">
                <tr>
                    <td style="padding: 2px 8px 2px 0; vertical-align: top; font-weight: 500; color: #333; width: 170px;">Name</td>
                    <td style="padding: 2px 8px 2px 0; vertical-align: top; width: 12px; color: #666; text-align: center; font-weight: 400;">:</td>
                    <td style="padding: 2px 8px 2px 0; vertical-align: top;">${data.name}</td>
                </tr>
                <tr>
                    <td style="padding: 2px 8px 2px 0; vertical-align: top; font-weight: 500; color: #333; width: 170px;">Father's Name</td>
                    <td style="padding: 2px 8px 2px 0; vertical-align: top; width: 12px; color: #666; text-align: center; font-weight: 400;">:</td>
                    <td style="padding: 2px 8px 2px 0; vertical-align: top;">${data.fatherName}</td>
                </tr>
                <tr>
                    <td style="padding: 2px 8px 2px 0; vertical-align: top; font-weight: 500; color: #333; width: 170px;">Date of Birth</td>
                    <td style="padding: 2px 8px 2px 0; vertical-align: top; width: 12px; color: #666; text-align: center; font-weight: 400;">:</td>
                    <td style="padding: 2px 8px 2px 0; vertical-align: top;">${formatDate(data.dob)}</td>
                </tr>
                <tr>
                    <td style="padding: 2px 8px 2px 0; vertical-align: top; font-weight: 500; color: #333; width: 170px;">Nationality</td>
                    <td style="padding: 2px 8px 2px 0; vertical-align: top; width: 12px; color: #666; text-align: center; font-weight: 400;">:</td>
                    <td style="padding: 2px 8px 2px 0; vertical-align: top;">${data.nationality}</td>
                </tr>
                <tr>
                    <td style="padding: 2px 8px 2px 0; vertical-align: top; font-weight: 500; color: #333; width: 170px;">Gender</td>
                    <td style="padding: 2px 8px 2px 0; vertical-align: top; width: 12px; color: #666; text-align: center; font-weight: 400;">:</td>
                    <td style="padding: 2px 8px 2px 0; vertical-align: top;">${data.gender}</td>
                </tr>
                <tr>
                    <td style="padding: 2px 8px 2px 0; vertical-align: top; font-weight: 500; color: #333; width: 170px;">Marital Status</td>
                    <td style="padding: 2px 8px 2px 0; vertical-align: top; width: 12px; color: #666; text-align: center; font-weight: 400;">:</td>
                    <td style="padding: 2px 8px 2px 0; vertical-align: top;">${data.maritalStatus}</td>
                </tr>
                <tr>
                    <td style="padding: 2px 8px 2px 0; vertical-align: top; font-weight: 500; color: #333; width: 170px;">Religion</td>
                    <td style="padding: 2px 8px 2px 0; vertical-align: top; width: 12px; color: #666; text-align: center; font-weight: 400;">:</td>
                    <td style="padding: 2px 8px 2px 0; vertical-align: top;">${data.religion}</td>
                </tr>
                ${visaStatusRow}
            </table>
            <div style="background: #337a7c; color: #fff; padding: 7px 16px; font-weight: bold; font-size: 1.05rem; letter-spacing: 1px; margin: 5px 0 7px -32px; width: calc(100% + 64px); box-sizing: border-box;">EDUCATIONAL QUALIFICATION</div>
            <ul style="margin: 0 0 0 20px; padding: 0; font-size: 0.95rem; margin-bottom: 15px;">
                ${Array.isArray(data.educations) ? data.educations.map(e => `<li>${e}</li>`).join('') : ''}
            </ul>
            <div style="background: #337a7c; color: #fff; padding: 7px 16px; font-weight: bold; font-size: 1.05rem; letter-spacing: 1px; margin: 5px 0 7px -32px; width: calc(100% + 64px); box-sizing: border-box;">LANGUAGE KNOWN</div>
            <div style="margin-bottom: 15px;"><span style="color: #337a7c; font-weight: bold;">${data.languages}</span></div>
            ${data.passports.length > 0 ? `
                <div style="background: #337a7c; color: #fff; padding: 7px 16px; font-weight: bold; font-size: 1.05rem; letter-spacing: 1px; margin: 5px 0 7px -32px; width: calc(100% + 64px); box-sizing: border-box;">PASSPORT DETAILS</div>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px; font-size: 0.9rem;">
                    <tr>
                        <th style="border: 1px solid #337a7c; padding: 3px 7px; font-size: 0.9rem; text-align: left; background: #e0f1f1; color: #337a7c;">Passport No</th>
                        <th style="border: 1px solid #337a7c; padding: 3px 7px; font-size: 0.9rem; text-align: left; background: #e0f1f1; color: #337a7c;">Date of Issue</th>
                        <th style="border: 1px solid #337a7c; padding: 3px 7px; font-size: 0.9rem; text-align: left; background: #e0f1f1; color: #337a7c;">Date of Expiry</th>
                        <th style="border: 1px solid #337a7c; padding: 3px 7px; font-size: 0.9rem; text-align: left; background: #e0f1f1; color: #337a7c;">Place of Issue</th>
                    </tr>
                    ${data.passports.map(passport => `
                        <tr>
                            <td style="border: 1px solid #337a7c; padding: 3px 7px; font-size: 0.9rem; text-align: left;">${passport.number}</td>
                            <td style="border: 1px solid #337a7c; padding: 3px 7px; font-size: 0.9rem; text-align: left;">${formatDate(passport.issueDate)}</td>
                            <td style="border: 1px solid #337a7c; padding: 3px 7px; font-size: 0.9rem; text-align: left;">${formatDate(passport.expiryDate)}</td>
                            <td style="border: 1px solid #337a7c; padding: 3px 7px; font-size: 0.9rem; text-align: left;">${passport.place}</td>
                        </tr>
                    `).join('')}
                </table>
            ` : ''}
            ${data.experiences.length > 0 ? `
                <div style="background: #337a7c; color: #fff; padding: 7px 16px; font-weight: bold; font-size: 1.05rem; letter-spacing: 1px; margin: 5px 0 7px -32px; width: calc(100% + 64px); box-sizing: border-box;">WORK EXPERIENCE</div>
                <div style="font-size:0.95rem; margin-bottom:7px;">
                    ${data.experiences.map(exp => `
                        <p style="margin-bottom: 8px;">
                            <b>Worked as a "${exp.title}"</b> in ${exp.company}
                            from ${formatDate(exp.fromDate)} to ${formatDate(exp.toDate)}
                            ${exp.description ? `<br>${exp.description}` : ''}
                        </p>
                    `).join('')}
                </div>
            ` : ''}
            <div style="background: #337a7c; color: #fff; padding: 7px 16px; font-weight: bold; font-size: 1.05rem; letter-spacing: 1px; margin: 5px 0 7px -32px; width: calc(100% + 64px); box-sizing: border-box;">DECLARATION</div>
            <div style="font-size:0.95rem; margin-bottom: 15px;">
                I hereby declare that the information provided above is true to the best of my knowledge and belief
            </div>
            <div style="display: flex; justify-content: flex-end; margin-top: 20px;">
                <div style="font-weight: bold; letter-spacing:1px;">${data.name.toUpperCase()}</div>
            </div>
        </div>
    `;
    previewContainer.innerHTML = resumeHTML;
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
}

function downloadResume() {
    showLoading();

    setTimeout(() => {
        const element = document.querySelector('.cv-container');
        if (!element) {
            hideLoading();
            showToast('Please generate resume first', 'error');
            return;
        }

        // Generate a random 4-digit number
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        // Get the user's name (remove spaces, fallback to 'resume')
        let userName = document.getElementById('name')?.value || '';
        userName = userName.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '') || 'resume';
        const fileName = `${userName}_${randomNum}.pdf`;

        // Use html2canvas to capture the element
        html2canvas(element, {
            scale: 1.5,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            width: element.offsetWidth,
            height: element.offsetHeight,
            scrollX: 0,
            scrollY: 0
        }).then(canvas => {
            // Create PDF using jsPDF
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            const imgWidth = 190; // A4 width minus margins
            const pageHeight = 277; // A4 height minus margins
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            // If content fits on one page
            if (imgHeight <= pageHeight) {
                pdf.addImage(canvas, 'JPEG', 10, 10, imgWidth, imgHeight);
            } else {
                // If content is too long, scale it down to fit on one page
                const scale = pageHeight / imgHeight;
                const scaledWidth = imgWidth * scale;
                const scaledHeight = imgHeight * scale;
                const xOffset = (210 - scaledWidth) / 2; // Center horizontally
                pdf.addImage(canvas, 'JPEG', xOffset, 10, scaledWidth, scaledHeight);
            }

            // Save the PDF
            pdf.save(fileName);
            hideLoading();
            showToast('Resume downloaded successfully!', 'success');
        }).catch(error => {
            console.error('PDF generation error:', error);
            hideLoading();
            showToast('Error downloading resume. Please try again.', 'error');
        });
    }, 500);
}

// Add dynamic education rows
function setupEducationRows() {
    const container = document.getElementById('educationContainer');
    const addBtn = document.getElementById('addEduBtn');
    addBtn.onclick = function() {
        const row = document.createElement('div');
        row.className = 'edu-row';
        row.style.display = 'flex';
        row.style.gap = '8px';
        row.style.marginBottom = '6px';
        row.innerHTML = `<input type="text" class="form-control edu-input" name="education[]" placeholder="e.g. Graduation" required><button type="button" class="remove-edu-btn" style="background:#ef4444; color:#fff; border:none; border-radius:4px; padding:0 10px; cursor:pointer;">×</button>`;
        row.querySelector('.remove-edu-btn').onclick = function() {
            row.remove();
        };
        // Show remove button for all except the first row
        Array.from(container.querySelectorAll('.remove-edu-btn')).forEach(btn => btn.style.display = 'inline-block');
        container.appendChild(row);
    };
    // Remove row logic for the first row (if more than one row exists)
    container.querySelector('.remove-edu-btn').onclick = function() {
        if (container.children.length > 1) {
            this.parentElement.remove();
        }
    };
} 