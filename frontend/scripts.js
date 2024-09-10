
const GPTResearcher = (() => {
  const init = () => {
    // Not sure, but I think it would be better to add event handlers here instead of in the HTML
    //document.getElementById("startResearch").addEventListener("click", startResearch);
    document
      .getElementById('copyToClipboard')
      .addEventListener('click', copyToClipboard)

    updateState('initial')

    // Initialize slider value on page load
    var budgetSlider = document.getElementById("budget");
    updateBudgetValue(budgetSlider.value);  // Set initial value based on slider's default position

    // Attach event listener to update the budget value dynamically as the slider moves
    budgetSlider.addEventListener("input", function () {
      updateBudgetValue(budgetSlider.value);
    });
  }

  // Function to dynamically update budget value as the slider moves
  function updateBudgetValue(value) {
    document.getElementById("budget_value").innerText = `£${value}`;
  }

  const changeSource = () => {
    const report_source = document.querySelector('select[name="report_source"]').value
    if (report_source === 'sources') {
        document.getElementById('sources').style.display = 'block'
    } else {
        document.getElementById('sources').style.display = 'none'
    }
  }

  const startResearch = () => {
    updateState('in_progress');
    
    document.getElementById('output').innerHTML = ''
    document.getElementById('reportContainer').innerHTML = ''

    addAgentResponse({
      output: '🤔 Thinking about research questions for the task...',
    })

    listenToSockEvents()
  }

  const listenToSockEvents = () => {
    const { protocol, host, pathname } = window.location
    const ws_uri = `${
      protocol === 'https:' ? 'wss:' : 'ws:'
    }//${host}${pathname}ws`
    const converter = new showdown.Converter()
    const socket = new WebSocket(ws_uri)

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'logs') {
        addAgentResponse(data)
      } else if (data.type === 'report') {
        writeReport(data, converter)
      } else if (data.type === 'path') {
        updateState('finished')
        updateDownloadLink(data)
      }
    }

  // Create the prompt based on user inputs
  function create_prompt(used_new_both, budget, country = "UK", brand_name = null, model_name = null, make_year = null, postcode = null,
    fuel_type = null, engine_specs = null, wheel_drive = null, gearbox = null, car_type = null, mileage = null) {
    let query = `I'm looking to buy a ${used_new_both} car in ${country} within a maximum budget of £${budget}.\n`;

    // Check if any optional parameters are provided
    if (brand_name || model_name || make_year || postcode || fuel_type || engine_specs || wheel_drive || gearbox || car_type || mileage) {
    query += "Here are the specifications I am looking at:\n";

    if (brand_name) query += `- ${brand_name} cars.\n`;
    if (model_name) query += `- ${model_name} model.\n`;
    if (make_year) query += `- ${make_year} make year.\n`;
    if (fuel_type) query += `- ${fuel_type} variant.\n`;

    query += "\nI'm interested in knowing:\n";
    query += "1. What are some common problems of this car?\n";

    if (engine_specs) {
    query += `2. What are some common problems of the ${engine_specs} engine in this car?\n`;
    } else {
    query += "2. What are some common problems of the different engine configurations found in this car?\n";
    }

    query += "3. Is it LEZ compliant? Is it CAZ (clean air zone) compliant? Is it ULEZ compliant?\n";
    query += "4. The checklist of things I need to check specific to this car when I go to check it out in person.\n";
    query += "5. How much does this car depreciate over time? Can I see a graph for detailed analysis?\n";
    query += "6. How much are the running and ownership costs?\n";

    if (gearbox) {
    query += `7. Are there any common issues with the ${gearbox} gearbox found in this car?\n`;
    } else {
    query += "7. Are there any common issues with the different gearbox configurations found in this car?\n";
    }

    if (wheel_drive) {
    query += `8. Are there any common issues with the ${wheel_drive} wheel drive found in this car?\n`;
    } else {
    query += "8. Are there any common issues with the different wheel drive configurations?\n";
    }

    if (car_type) {
    query += `9. Are there any common issues with the ${car_type} body type?\n`;
    } else {
    query += "9. Are there any common issues with the different body types of this car?\n";
    }

    if (mileage) {
    query += `10. Are there any common issues if this car has done ${mileage} miles?\n`;
    }

    query += "11. Does the car come with Android Auto and Apple CarPlay? If not, what are the aftermarket solutions?\n";

    if (postcode) {
    query += `12. Are there any ${brand_name} specialist garages near ${postcode}? How much do they charge for service?\n`;
    }

    } else {
    query += "Give me a list of top 10 cars that I can buy based on a comparative analysis of:\n";
    query += "- Common problems\n";
    query += "- Technology features\n";
    query += "- LEZ, CAZ, and ULEZ compliance\n";
    query += "- Depreciation over time\n";
    query += "- Running and ownership costs\n";
    }

    return query;
  }


  socket.onopen = (event) => {
    const used_new_both = document.querySelector('select[name="used_new_both"]').value;
    const budget = document.querySelector('input[name="budget"]').value;
    const country = document.querySelector('input[name="country"]').value || "UK";  // Default to UK if not provided
    const brand_name = document.querySelector('input[name="brand_name"]').value || null;
    const model_name = document.querySelector('input[name="model_name"]').value || null;
    const make_year = document.querySelector('input[name="make_year"]').value || null;
    const fuel_type = document.querySelector('input[name="fuel_type"]').value || null;
    const engine_specs = document.querySelector('input[name="engine_specs"]').value || null;
    const gearbox = document.querySelector('input[name="gearbox"]').value || null;
    const wheel_drive = document.querySelector('input[name="wheel_drive"]').value || null;
    const car_type = document.querySelector('input[name="car_type"]').value || null;
    const mileage = document.querySelector('input[name="mileage"]').value || null;
    const postcode = document.querySelector('input[name="postcode"]').value || null;
  
    // Create the task using the JavaScript version of create_prompt
    const task = create_prompt(used_new_both, budget, country, brand_name, model_name, make_year, postcode, fuel_type, engine_specs, wheel_drive, gearbox, car_type, mileage);
  
    const report_type = "detailed_report";
    const report_source = "web";
    const tone = "Analytical";
    const agent = document.querySelector('input[name="agent"]:checked').value;
    let source_urls = tags;
  
    if (report_source !== 'sources' && source_urls.length > 0) {
      source_urls = source_urls.slice(0, source_urls.length - 1);
    }
  
    const requestData = {
      task: task,  // The task is now generated in JavaScript
      report_type: report_type,
      report_source: report_source,
      source_urls: source_urls,
      tone: tone,
      agent: agent,
    };
  
    socket.send(`start ${JSON.stringify(requestData)}`);
  };
  

    // socket.onopen = (event) => {
    //   const task = document.querySelector('input[name="task"]').value
    //   const report_type = "detailed_report"
    //   const report_source = "web" 
    //   const tone = "Analytical";
    //   const agent = document.querySelector('input[name="agent"]:checked').value
    //   let source_urls = tags

    //   if (report_source !== 'sources' && source_urls.length > 0) {
    //     source_urls = source_urls.slice(0, source_urls.length - 1)
    //   }

    //   const requestData = {
    //     task: task,
    //     report_type: report_type,
    //     report_source: report_source,
    //     source_urls: source_urls,
    //     tone: tone,
    //     agent: agent,
    //   }

    //   socket.send(`start ${JSON.stringify(requestData)}`)
    // }
  }

  const addAgentResponse = (data) => {
    const output = document.getElementById('output')
    output.innerHTML += '<div class="agent_response">' + data.output + '</div>'
    output.scrollTop = output.scrollHeight
    output.style.display = 'block'
    updateScroll()
  }

  const writeReport = (data, converter) => {
    const reportContainer = document.getElementById('reportContainer')
    const markdownOutput = converter.makeHtml(data.output)
    reportContainer.innerHTML += markdownOutput
    updateScroll()
  }

  const updateDownloadLink = (data) => {
    const pdf_path = data.output.pdf
    const docx_path = data.output.docx
    const md_path = data.output.md;
    document.getElementById('downloadLink').setAttribute('href', pdf_path);
    document.getElementById('downloadLinkWord').setAttribute('href', docx_path);
    document.getElementById("downloadLinkMd").setAttribute("href", md_path);
  }

  const updateScroll = () => {
    window.scrollTo(0, document.body.scrollHeight)
  }

  const copyToClipboard = () => {
    const textarea = document.createElement('textarea')
    textarea.id = 'temp_element'
    textarea.style.height = 0
    document.body.appendChild(textarea)
    textarea.value = document.getElementById('reportContainer').innerText
    const selector = document.querySelector('#temp_element')
    selector.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }

  const updateState = (state) => {
    var status = ''
    switch (state) {
      case 'in_progress':
        status = 'Research in progress...'
        setReportActionsStatus('disabled')
        break
      case 'finished':
        status = 'Research finished!'
        setReportActionsStatus('enabled')
        break
      case 'error':
        status = 'Research failed!'
        setReportActionsStatus('disabled')
        break
      case 'initial':
        status = ''
        setReportActionsStatus('hidden')
        break
      default:
        setReportActionsStatus('disabled')
    }
    document.getElementById('status').innerHTML = status
    document.getElementById('status').style.display = status ? 'block' : 'none';
  }

  /**
   * Shows or hides the download and copy buttons
   * @param {str} status Kind of hacky. Takes "enabled", "disabled", or "hidden". "Hidden is same as disabled but also hides the div"
   */
  const setReportActionsStatus = (status) => {
    const reportActions = document.getElementById('reportActions')
    // Disable everything in reportActions until research is finished

    if (status == 'enabled') {
      reportActions.querySelectorAll('a').forEach((link) => {
        link.classList.remove('disabled')
        link.removeAttribute('onclick')
        reportActions.style.display = 'block'
      })
    } else {
      reportActions.querySelectorAll('a').forEach((link) => {
        link.classList.add('disabled')
        link.setAttribute('onclick', 'return false;')
      })
      if (status == 'hidden') {
        reportActions.style.display = 'none'
      }
    }
  }

  const tagsInput = document.getElementById('tags-input');
  const input = document.getElementById('custom_source');

  const tags = [];

  const addTag = (url) => {
    if (tags.includes(url)) return;
    tags.push(url);

    const tagElement = document.createElement('span');
    tagElement.className = 'tag';
    tagElement.textContent = url;

    const removeButton = document.createElement('span');
    removeButton.className = 'remove-tag';
    removeButton.textContent = 'x';
    removeButton.onclick = function () {
        tagsInput.removeChild(tagElement);
        tags.splice(tags.indexOf(url), 1);
    };

    tagElement.appendChild(removeButton);
    tagsInput.insertBefore(tagElement, input);
  }

  document.addEventListener('DOMContentLoaded', init)
  return {
    startResearch,
    copyToClipboard,
    changeSource,
    addTag,
  }
})()
