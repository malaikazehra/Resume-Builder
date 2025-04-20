window.onload = function() {
    // Pre-fill the form fields with fake details
    document.getElementById("name").value = "Sarah Smith";
    document.getElementById("title").value = "Front-End Developer";
    document.getElementById("contact").value = "987-654-3210";
    document.getElementById("email").value = "sarah.smith@example.com";
    document.getElementById("summary").value = "Creative and detail-oriented front-end developer with 4+ years of experience in building responsive, user-friendly websites and applications. Passionate about coding and design, with a deep understanding of HTML, CSS, and JavaScript.";
    document.getElementById("skills").value = "HTML, CSS, JavaScript, React, Bootstrap, Git, REST APIs, Adobe XD";
    document.getElementById("education").value = "Bachelor's Degree in Information Technology, ABC University, 2020";
    document.getElementById("experience").value = "Front-End Developer at Web Solutions, 2020 - Present. Collaborated with the design team to build responsive websites, optimized user experiences, and implemented interactive features using JavaScript and React.";
    
    // Automatically generate the resume on page load
    generateResume();
  }
  
  
  
  
  function generateResume() {
    const name = document.getElementById("name").value.trim();
    const title = document.getElementById("title").value.trim();
    const contact = document.getElementById("contact").value.trim();
    const email = document.getElementById("email").value.trim();
    const summary = document.getElementById("summary").value.trim();
    const skills = document.getElementById("skills").value.split(',').map(s => s.trim()).filter(Boolean);
    const education = document.getElementById("education").value.trim();
    const experience = document.getElementById("experience").value.trim();
    const theme = document.getElementById("theme").value;
    
    // Get customization options
    const bgColor = document.getElementById("backgroundColor").value;
    const fontColor = document.getElementById("fontColor").value;
    const fontFamily = document.getElementById("fontFamily").value;
  
    const resume = document.getElementById("resume");
    if (!name || !title || !contact || !summary || skills.length === 0 || !education || !experience) {
      resume.innerHTML = `
        <div class="alert alert-danger">
          <i class="bi bi-exclamation-triangle"></i> Please fill in all required fields before generating the resume.
        </div>
      `;
      return;
    }
  
    // Apply theme as base style
    if (theme) {
      resume.className = `resume-preview ${theme}`;
    } else {
      resume.className = 'resume-preview';
    }
    
    // Apply custom styles regardless of theme selection
    resume.style.backgroundColor = bgColor;
    resume.style.color = fontColor;
    resume.style.fontFamily = fontFamily;
    
    // Generate header with appropriate styling
    const headerBgColor = shadeColor(bgColor, -30); // Darken by 20% for header
    const headerStyle = `style="background-color: ${headerBgColor}; color: ${fontColor === '#000000' ? '#fff' : fontColor}"`;
    
    resume.innerHTML = `
      <div class="header" ${headerStyle}>
        <h2 class="m-0">${name}</h2>
        <p class="m-0">${title}</p>
        <small>${contact} | ${email}</small>
      </div>
      <div class="resume-section">
        <div class="section-title">Summary</div>
        <p>${summary}</p>
      </div>
      <div class="resume-section">
        <div class="section-title">Skills</div>
        <ul>${skills.map(skill => `<li>${skill}</li>`).join('')}</ul>
      </div>
      <div class="resume-section">
        <div class="section-title">Education</div>
        <p>${education}</p>
      </div>
      <div class="resume-section">
        <div class="section-title">Experience</div>
        <p>${experience}</p>
      </div>
    `;
  }
  
  // Helper function to lighten/darken colors
  function shadeColor(color, percent) {
    let R = parseInt(color.substring(1,3), 16);
    let G = parseInt(color.substring(3,5), 16);
    let B = parseInt(color.substring(5,7), 16);
  
    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);
  
    R = (R<255)?R:255;  
    G = (G<255)?G:255;  
    B = (B<255)?B:255;  
  
    R = Math.round(R);
    G = Math.round(G);
    B = Math.round(B);
  
    const RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
    const GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
    const BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));
  
    return "#"+RR+GG+BB;
  }
  
  function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const resumeElement = document.getElementById('resume');
    
    // Set dimensions for A4 paper (210x297mm)
    const pdfWidth = 210; // mm
    const pdfHeight = 297; // mm
    
    // Create clone of resume element for PDF generation
    const clone = resumeElement.cloneNode(true);
    document.body.appendChild(clone);
    clone.style.width = pdfWidth + 'mm';
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    clone.style.top = '0';
    clone.style.visibility = 'visible';
  
    html2canvas(clone, {
      scale: 2, // Higher quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
      windowWidth: clone.scrollWidth,
      windowHeight: clone.scrollHeight
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Calculate dimensions to fit full page
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // Add image to PDF (cover full page)
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Clean up
      document.body.removeChild(clone);
      
      // Save the PDF
      pdf.save('resume.pdf');
    }).catch(error => {
      console.error('Error generating PDF:', error);
      document.body.removeChild(clone);
    });
  }
  
  function printResume() {
    const resumeElement = document.getElementById('resume');
    const printWindow = window.open('', '', 'width=800,height=600');
    
    // Get all styles from the page
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(el => el.outerHTML)
      .join('');
  
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Resume</title>
          ${styles}
          <style>
            @page {
              size: A4;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              width: 210mm;
              height: 297mm;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .resume-preview {
              width: 210mm !important;
              min-height: 297mm !important;
              margin: 0 !important;
              padding: 15mm !important;
              box-shadow: none !important;
              box-sizing: border-box;
            }
          </style>
        </head>
        <body>
          ${resumeElement.outerHTML}
          <script>
            setTimeout(function() {
              window.print();
              window.close();
            }, 300);
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  }
  
  function resetDesign() {
    // Reset customization options
    document.getElementById("backgroundColor").value = "#ffffff";
    document.getElementById("fontColor").value = "#000000";
    document.getElementById("fontFamily").value = "Arial, sans-serif";
    document.getElementById("theme").value = "";
    
    // Re-generate the resume with current details but default design
    generateResume();
  }
  