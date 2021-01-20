'use strict'

/**
 * Fix num cores, allowing blanks to remain
 */
function fix_num_cores() {
  let node_type_input = $('#batch_connect_session_context_node_type');
  let node_type = node_type_input.val();
  let num_cores_input = $('#num_cores');

  if(num_cores_input.val() === '') {
    return;
  }

  if(node_type === 'hugemem') {
    set_ppn_owens_hugemem(num_cores_input);
  } else {
    set_ppn_owens_regular(num_cores_input);
  }
}

/**
 * Sets the PPN limits available for Owens hugemem nodes.
 *
 * hugemem reservations are always assigned the full node
 *
 * @param      {element}  num_cores_input  The input for num_cores
 */
function set_ppn_owens_hugemem(num_cores_input) {
  const NUM_CORES = 48;
  num_cores_input.attr('max', NUM_CORES);
  num_cores_input.attr('min', NUM_CORES);
  num_cores_input.val(NUM_CORES);
}

/**
 * Sets the PPN limits available for non hugemem Owens nodes.
 *
 * @param      {element}  num_cores_input  The input for num_cores
 */
function set_ppn_owens_regular(num_cores_input) {
  const NUM_CORES = 28;
  num_cores_input.attr('max', NUM_CORES);
  num_cores_input.attr('min', 0);
  num_cores_input.val(Math.min(NUM_CORES, num_cores_input.val()));
}

/**
 * Toggle the visibilty of a form group
 *
 * @param      {string}    form_id  The form identifier
 * @param      {boolean}   show     Whether to show or hide
 */
function toggle_visibilty_of_form_group(form_id, show) {
  let form_element = $(form_id);
  let parent = form_element.parent();

  if(show) {
    parent.show();
  } else {
    form_element.val('');
    parent.hide();
  }
}

/**
 * Toggle the visibilty of the license fields
 *
 * Academic: hidden
 * Commercial: visible
 */
function toggle_license_field_visibility() {
  let user_license_provider = $("#batch_connect_session_context_user_license_provider");

  toggle_visibilty_of_form_group(
    '#batch_connect_session_context_extern_license_server',
    user_license_provider.val() === 'external'
  );
  toggle_visibilty_of_form_group(
    '#batch_connect_session_context_extern_license_file',
    user_license_provider.val() === 'external'
  );
}

/**
 * Sets the change handler for the node_type select.
 */
function set_node_type_change_handler() {
  let node_type_input = $('#batch_connect_session_context_node_type');
  node_type_input.change(node_type_input, fix_num_cores);
}

/**
 * Sets the change handler for the user_is_commercial_user select.
 */
function set_user_license_provider_change_handler() {
  let user_license_provider = $("#batch_connect_session_context_user_license_provider");
  user_license_provider.change(toggle_license_field_visibility);
}

/**
 * Hide executables which aren't supported in a specific versions. 
 */
function hide_unsupported_executables() {
  let select_version_value = $("#batch_connect_session_context_version").val();
  let select_executable_command = $('#batch_connect_session_context_executable_command');

  console.log("*** *** ***");
  console.log(select_version_value);
  console.log(select_executable_command.val());
  // test if user select version with no license of ANSYS Mechanical
  if (select_version_value === "ansys-2020-R1" || select_version_value === "ansys-2019-R3") {
    console.log("if true");
    // hide ANSYS Mechanical executable
    select_executable_command.children("option[value^=mapdl]").hide()
    // if Mechanical executable was selected, change it to another
    if (select_executable_command.val() === "mapdl -g") {
      select_executable_command.val("fluent")
    }
  } else {
    // show all executables
    select_executable_command.children('option').show();
  }

  //$('#batch_connect_session_context_executable_command').children('option').hide();
}

/**
 * Install event handlers
 */
$(document).ready(function() {
  // Set the max value to be what was set in the last session
  fix_num_cores();
  // Ensure that fields are shown or hidden based on what was set in the last session
  toggle_license_field_visibility();
  
  set_node_type_change_handler();
  set_user_license_provider_change_handler();

  // hide unsupported executables according to the selected version
  hide_unsupported_executables(); // run when page is ready
  $("#batch_connect_session_context_version").change(function() { // run everytime when selected version is changed
    hide_unsupported_executables();
  })
});
