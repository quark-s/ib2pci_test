
/**
 * implements the COMPLEX matching
 * @author Raynald JADOUL - Tudor
 *
 */

// when the signature (in Flash) was class lu.tao.tao_scoring.TaoCOMPLEX, a typical call was
// switch(vTagToEval){
//   case "INTERVAL":
//   case "MATCH":
//   case "COMPLEX":{
//     itemResult_bool = new TaoCOMPLEX(base_mc._widgetsRepository_array,vTagToEval).scoreThis(vInquiryAnswer_str);
// }
// with vInquiryAnswer_str = xmlItemDescription_obj["tao:ITEM"][0]["tao:INQUIRY"][vCpt]["tao:INQUIRYDESCRIPTION"][0]["tao:HASANSWER"][0].data

// collection of useful functions
//class lu.tao.utils.tao_toolbox {
// USAGE:
// var str = "<h1>Example of stripTag function</h1>";
// str = str.stripTag();
// will return "Example of stripTag function"

function stripTag(vInitial) {
    var workString = (vInitial);
    var i = workString.indexOf("<");
    var j = workString.indexOf(">", i);
    while((i > -1) && (j > -1)) {
        workString = workString.substring(0, i) + workString.substring(j + 1);
        i = workString.indexOf("<", i);
        j = workString.indexOf(">", i);
    }
    return workString;
}

function cleanString(vInitial, vSpace, vTAB, vLF, vCR) { //CHR: #x20, #x09, #x0A, #x0D
    var workString = (vInitial);
    var workArray = new Array();
    workArray = workString.split("");
    workString = "";
    for(var vCpt = 0; vCpt < workArray.length; vCpt++) {
        switch(workArray[vCpt]) {
            case " ": {
                workString += (vSpace) ? "" : workArray[vCpt];
                break;
            }
            case "\t": {
                workString += (vTAB) ? "" : workArray[vCpt];
                break;
            }
            case "\n": {
                workString += (vLF) ? "" : workArray[vCpt];
                break;
            }
            case "\r": {
                workString += (vCR) ? "" : workArray[vCpt];
                break;
            }
            default : {
                workString += workArray[vCpt];
            }
        }
    }
    return(workString);
}

function trimString(vInitial, vLeft, vRight) {
    if(vInitial == undefined){
        vInitial = "";
    }
    var workString = vInitial;
    var workArray = new Array();
    workArray = workString.split("");
    var a = 0;
    if(vLeft == true) {
        while((a < workArray.length) && (workArray[a] == " ")) {
            a++;
        }
        workString = workString.substring(a);
    }
    workArray = workString.split("");
    if(vRight == true) {
        a = workArray.length - 1;
        while((a >= 0) && (workArray[a] == " ")) {
            a--;
        }
        a = a + 1;
        workString = workString.substring(0, a);
    }
    return(workString);
}

function isIn(vElement, vHaystack) {
    var vResult_bool = false;
    for(var vCpt_num = 0; vCpt_num < vHaystack.length; vCpt_num++) {
        if(vHaystack[vCpt_num] == vElement) {
            vResult_bool = true;
            break;
        }
    }
    return(vResult_bool);
}

function trimStringMask(vInitial, vMask, vLeftRight) {
    var workString = (vInitial);
    var leftRight_str = (vLeftRight);
    var theMask_str = (vMask);
    var theMask_array = new Array();
    var workArray = new Array();
    var vLeft;
    var vRight;
    var a = 0;

    theMask_array = theMask_str.split("");
    leftRight_str = leftRight_str.toUpperCase();
    vLeft = (leftRight_str == "LEFT") ? true : (leftRight_str == "BOTH") ? true : false;
    vRight = (leftRight_str == "RIGHT") ? true : (leftRight_str == "BOTH") ? true : false;
    workArray = workString.split("");
    if(vLeft == true) {
        while((a < workArray.length) && isIn(workArray[a], theMask_array)) {
            a++;
        }
        workString = workString.substring(a);
    }
    workArray = workString.split("");
    if(vRight == true) {
        a = workArray.length - 1;
        while((a >= 0) && isIn(workArray[a], theMask_array)) {
            a--;
        }
        a = a + 1;
        workString = workString.substring(0, a);
    }
    return(workString);
}

function cleanStringMask(vInitial, vMask) { //for CHR: #x20, #x09, #x0A, #x0D -> cleanString should be used
    var workString = (vInitial);
    var theMask_str = (vMask);
    var theMask_array = new Array();
    theMask_array = theMask_str.split("");
    var workArray = new Array();
    workArray = workString.split("");
    workString = "";
    for(var vCpt = 0; vCpt < workArray.length; vCpt++) {
        if(!(isIn(workArray[vCpt], theMask_array))) {
            workString += workArray[vCpt];
        }
    }
    return(workString);
}

function replaceString(vInitial, vTarget, vReplacer) {
    //    vInitial.split(vTarget).join(vReplacer); // shortcut
    var workString = (vInitial);
    var workArray = new Array();
    workArray = workString.split(vTarget);
    workString = "";
    for(var a = 0; a < workArray.length; a++) {
        if(a < (workArray.length - 1)) {
            workString = workString + workArray[a] + vReplacer;
        }
        else {
            workString = workString + workArray[a];
        }
    }
    return(workString);
}

function transmuteString(vInitial, vTarget, vReplacer, vOriginal, vTransmuted) {
    var workString = (vInitial);
    var workArray = new Array();
    var originalStart;
    var original = vOriginal;
    workArray = workString.split(vTarget);
    workString = "";
    for(var a = 0; a < workArray.length; a++) {
        if(a < (workArray.length - 1)) {
            workString = workString + workArray[a] + vReplacer;
        }
        else {
            workString = workString + workArray[a];
        }
        originalStart = workString.lastIndexOf(original);
        if(originalStart != -1) {
            workString = workString.substr(0, originalStart) + vTransmuted + workString.substr(originalStart + original.length);
        }
    }
    return(workString);
}

function htmlThis(vInitial) {
    var workString = (vInitial);
    workString = replaceString(workString, "&", "&amp;");
    workString = replaceString(workString, "\"", "&quot;");
    workString = replaceString(workString, "'", "&apos;");
    workString = replaceString(workString, "<", "&lt;");
    workString = replaceString(workString, ">", "&gt;");
    return(workString);
}

function unhtmlThis(vInitial) {
    var workString = (vInitial);
    workString = replaceString(workString, "&amp;", "&");
    workString = replaceString(workString, "&quot;", "\"");
    workString = replaceString(workString, "&apos;", "'");
    workString = replaceString(workString, "&lt;", "<");
    workString = replaceString(workString, "&gt;", ">");
    return(workString);
}

function format(vInitial, vToken, vTotalLen, vOrientation) { //orientation is "leftPad" or "rightPad"
    var workString = (vInitial);
    var initialLen = workString.length;
    var appended_str = "";
    var vOrientation_str = (vOrientation);
    vOrientation_str = vOrientation_str.toUpperCase();

    for(var vCpt = 0; vCpt < (vTotalLen - initialLen); vCpt++) {
        appended_str = appended_str.concat(vToken);
    }
    switch(vOrientation_str) {
        case "LEFTPAD": {
            workString = appended_str + workString;
            break;
        }
        case "RIGHTPAD": {
            // break; // no need 'cause same as default case
            }
        default : {
            workString = workString.concat(appended_str);
        }
    }
    return(workString);
}

function extractString(vInitial, vTarget1, vTarget2, vOffset, vWith) {
    var workString = (vInitial);
    var finalResult = "";
    var workIndex1;
    var workIndex2;
    workIndex1 = workString.indexOf(vTarget1);
    if(workIndex1 == -1) {
        workIndex1 = 0;
    }
    else {
        workIndex1 = workIndex1 + vTarget1.length;
    }
    if(vTarget2 == "") {
        workIndex2 = workString.length;
    }
    else {
        workIndex2 = workString.indexOf(vTarget2, workIndex1 + vOffset);
        if(workIndex2 == -1) {
            workIndex2 = workString.length;
        }
    }
    if(vWith == true) {
        finalResult = vTarget1 + workString.slice(workIndex1, workIndex2) + vTarget2;
    }
    else {
        finalResult = workString.slice(workIndex1, workIndex2);
    }
    return(finalResult);
}

//class lu.tao.utils.tao_calculator{
/*************************************
** attributes
*/
var max_char;
var p_binary_op;
var p_unary_op;
var p_object;
var p_level;
var v_indices;
var v_value;
var v_name;
var delimiters;
var do_unary;
var level;
var base_level;
var accum_ind;
var var_ind;
var variable_index;
var accum_pos;

function tao_calculator(){
    max_char = 512;
    p_binary_op = new Array();
    p_unary_op = new Array();
    p_object = new Array();
    p_level = new Array();
    v_indices = new Array();
    v_value = new Array();
    v_name = new Array();
    delimiters = new Array("+","-","*","/","(",")"," ","^");
    do_unary = 0;
    variable_index = new Array(); // This is the index of the variable for a plot
}
/*************************************
** Remove space characters from a string
*/
function remove_space(xpr){
    var expression = (xpr);
    var newstr = "";
    for(var i=0;i<expression.length;i++){
        if(expression.charAt(i) != " "){
            newstr = newstr+expression.charAt(i);
        }
    }
    return newstr;
}
function cleanComma(vInitial){
    var workString = (vInitial);
    var workArray = new Array();
    workArray = workString.split("");
    workString = "";
    for(var vCpt=0;vCpt<workArray.length;vCpt++){
        if(workArray[vCpt] != ","){
            workString += workArray[vCpt];
        }
    }
    return(workString);
}
function formatNumber(expression_str){
    //console.log("CPLX IN  formatNumber with expression_str with " + expression_str);
    var vResult_str;
    vResult_str = expression_str;
    //console.log("CPLX OUT formatNumber with vResult_str with " + vResult_str);
    return(vResult_str);
}
function setupNumber(xpr){
    var localNum_num;
    var localNum_str;
    localNum_str = String(xpr);
    //		localNum_num = (localNum_str.indexOf(".") != -1) ? Number(localNum_str) : Number(localNum_str + ".");
    localNum_num = Number(formatNumber(localNum_str));
    return(localNum_num);
}
function prepare(xpr){
    //console.log("Before Calc Preparation: " + xpr);
    var expression = (xpr);
    var newstr = "";
    var vCpt=0;
    while(vCpt<(expression.length)){
        if(((expression.charAt(vCpt) == "e") || (expression.charAt(vCpt) == "E")) && (expression.charAt(vCpt + 1) != "^")){
            if((isNaN(Number(expression.charAt(vCpt + 1))) == false) || (expression.charAt(vCpt + 1) == "-")){
                var tmpIndex = vCpt + 1;
                while((tmpIndex < (expression.length - 1)) && ((expression.charAt(tmpIndex) == "-") || (expression.charAt(tmpIndex) == ".") || (isNaN(Number(expression.charAt(tmpIndex))) == false))){
                    tmpIndex++ ;
                }
                if(tmpIndex == (expression.length - 1)){
                    tmpIndex++ ;
                }
                newstr += "*10^(" + expression.substring(vCpt + 1,tmpIndex) + ")";
                vCpt = tmpIndex - 1;
            }
        }
        else{
            newstr += expression.charAt(vCpt);
        }
        vCpt++;
    }
    //		newstr += expression.charAt(expression.length - 1);
    //console.log("After Calc Preparation: " + newstr);
    return newstr;
}
/*************************************
** Perform a few initialization tasks
*/
function preparse(xpr){
    // renew arrays
    p_binary_op = new Array;
    p_unary_op = new Array;
    p_object = new Array;
    p_level = new Array;
    v_indices = new Array;
    v_value = new Array;
    v_name = new Array;
    // other variables
    var theta = 1;
    var count = 0;
    var expression = (xpr);
    var p = expression.split("(");
    count = p.length-1;
    p = expression.split(")");
    count -= p.length-1;
    // Here are useful preassigned constants

    v_value[0] = -1;
    v_name[0] = "-1";
    v_value[1] = Math.PI;
    v_name[1] = "pi";
    v_value[2] = Math.E;
    v_name[2] = "e";
    accum_ind = 0;
    var_ind = 3;
    level = 0;
    base_level = 0;
    return count;
}

/*************************************
** Parse a mathematical expression
** Warning:  while this does use recursion (no way around it
** for this problem), it does not follow the usual precepts
** of parsing mathematical expressions.  Instead of building
** complicated hash tables and tree structures to represent
** the expression, it builds a single 4-d array (actually
** four 1-d arrays) that can be evaluated by pushing and
** popping from a stack.  This makes the evaluation process
** quite fast - an important consideration in trying to
** plot functions using this tool...
** The idea here is to use "levels" to describe to an evaluation
** function the priority of the operation.  Since multiplication/
** division takes precedence over addition, it raises the level
** by one.  Exponentiation takes precedence over multiplication,
** so it raises the level by two.  Parentheses take precedence
** over everything, so they raise the level by three.  They
** also raise the "base level" - the level below which the
** level indicator cannot go.
*/
function parse(xpr){
    var delim_pos = new Array;
    var delim_type = new Array;
    var i=0;
    var istart=0;
    var val;
    var j;
    var exponentiating=0;
    var multiplying=0;
    var var_found = 0;
    var expression = (xpr);
    /*
    ** First find the separators between objects.
    */
    for(j=0;j<delimiters.length;j++){
        while(expression.indexOf(delimiters[j],istart) >= 0){
            delim_pos[i] = expression.indexOf(delimiters[j],istart);
            istart = delim_pos[i]+1;
            i++;
        }
        istart = 0;
    }
    delim_pos.sort(order);
    ////console.log(delim_pos);
    /*
    ** Now parse it into four arrays
    */
    i = 0;  	// Count objects
    j = 0;		// Count delimiters
    istart = 0;
    // First deal with a leading minus sign
    if(expression.charAt(0) == '-'){
        p_object[accum_ind] = 0;
        p_level[accum_ind] = ++level;
        if(!p_unary_op[accum_ind]) p_unary_op[accum_ind] = 0;
        p_binary_op[accum_ind] = 2;
        accum_ind++;
        istart=1;
        //multiplying = 1;
        i = 1;
    }
    // Now parse the rest
    var end = delim_pos.length;
    delim_pos[end] = expression.length;
    end++;
    /**
    ** This is the beginning of the big loop over the whole
    ** expression
    */
    for(j=istart;j<end;j++){
        if(expression.charAt(istart) == '('){
            level += 3;
            base_level += 3;
            // Beware - recursion here.
            j += parse(expression.substr(istart+1));
            j++;	// Pass the right parenthesis we just finished.
            istart = delim_pos[j];
        }
        var obj = expression.substring(istart,delim_pos[j]);
        // Deal with special functions.  This section does
        // the same as above, but sticks a unary operation in as
        // well.
        p_unary_op[accum_ind] = assign_unary_op(obj);
        if(p_unary_op[accum_ind] > 0){
            //				var_found = 1;
            p_binary_op[accum_ind] = 699;
            p_object[accum_ind] = 0;
            p_level[accum_ind] = level+3;
            accum_ind++;
            istart = delim_pos[j];
            level += 3;
            base_level += 3;
            // Beware - recursion here.
            j += parse(expression.substr(istart+1));
            j++;	// Pass the right parenthesis we just finished.
            istart = delim_pos[j];
            // Set up to finish the steps with the next object.
            obj = expression.substring(istart,delim_pos[j]);
            p_unary_op[accum_pos] = 0;
            do_unary = 0;
        }
        if((expression.charAt(delim_pos[j]) == '*') || (expression.charAt(delim_pos[j]) == '/')){
            if(expression.charAt(delim_pos[j]) == '*'){
                p_binary_op[accum_ind] = 2;
            }
            else{
                p_binary_op[accum_ind] = 3;
            }
            /*if(exponentiating > 0){
                level--;
                exponentiating = 0;
            }
            else{
                if(multiplying == 0) {
                    //multiplying = 1;
                    level++;
                }
            }*/
            level = base_level+1;
        }
        if(expression.charAt(delim_pos[j]) == '^'){
            //level++;
            //level += 2;
            level = base_level+2;
            exponentiating = 1;
            multiplying = 0;
            p_binary_op[accum_ind] = 4;
        }
        if((expression.charAt(delim_pos[j]) == '+') || (expression.charAt(delim_pos[j]) == '-')){
            //level -= 1;
            level = base_level;
            multiplying = 0;
            exponentiating = 0;
            if(expression.charAt(delim_pos[j]) == '+'){
                p_binary_op[accum_ind] = 0;
            }
            else{
                p_binary_op[accum_ind] = 1;
            }
        }
        if(level < base_level) {
            level = base_level;
        }
        if(do_unary == 0){
            // If there was no special function, look for variables
            var_found = 0;
            for(i=0;i<v_name.length;i++){
                if(v_name[i] == obj){
                    p_object[accum_ind] = i;
                    p_level[accum_ind] = level;
                    var_found = 1;
                    accum_ind++;
                    break;
                }
            }
            if(var_found == 0){
                if(istart < delim_pos[j]){
                    v_name[var_ind] = obj;
                    v_value[var_ind] = obj;
                    p_object[accum_ind] = var_ind;
                }
                else{  // This means we just exited parentheses
                    p_object[accum_ind] = 1;
                    if(expression.charAt(delim_pos[j]) == '^'){
                        level++;
                    }
                }
                p_level[accum_ind] = level;
                var_ind++;
                accum_ind++;
            }
        }
        if(expression.charAt(delim_pos[j]) == ')'){
            p_level[accum_ind-1] = base_level;
            level -= 3;
            base_level -= 3;
            //if(expression.charAt(delim_pos[j+1]) ne '^'){
            //p_level[accum_ind-1] = level;
            // }
            p_binary_op[accum_ind-1] = 899;
            return j+1;
        }
        istart = delim_pos[j]+1;
    }
    p_binary_op[accum_ind-1] = -1;
    p_level[accum_ind-1] = level;
    /*//console.log("Variables");
    //console.log(v_name);
    //console.log(v_value);
    //console.log("Objects");
    //console.log(p_object);
    //console.log(p_level);
    //console.log(p_unary_op);
    //console.log(p_binary_op);
    //console.log("---End of object ---");*/
    return delim_pos[end];
}

/*************************************
** Evaluator
*/
function evaluate (){
    var a_stack = new Array;
    var a_op = new Array;
    var a_level = new Array;
    var a_unary = new Array;
    var i=0;
    var ip1;
    var sp1;
    var stack_pos=0;
    var cur_level;
    if(p_object.length < 1){
        return 0;
    }
    a_stack[0] = v_value[p_object[0]];
    a_level[0] = p_level[0];
    a_op[0] = p_binary_op[0];
    a_unary[0] = p_unary_op[0];
    while(p_binary_op[i] >= 0){
        ip1 = i+1;
        if(a_op[stack_pos] == 899){
            // Preserve the next operation, and make sure the level
            // carries through.
            a_op[stack_pos] = p_binary_op[ip1];
            a_level[stack_pos] = p_level[ip1];
            // This is the end of a grouping
            // Collapse the current level and do the unary operation
            cur_level = a_level[stack_pos];
            while((stack_pos > 0) && (a_level[stack_pos-1] >= cur_level)){
                //If a unary operator applies, save it until the stack
                // is collapsed.
                if((a_level[stack_pos-1] == cur_level) && (a_op[stack_pos-1] == 699)) break;
                sp1 = stack_pos;
                stack_pos--;
                if(a_op[stack_pos] == 699){
                    a_stack[stack_pos] = a_stack[sp1];
                    a_stack[stack_pos] = unary(a_stack[stack_pos],a_unary[stack_pos]);
                }
                else {
                    a_stack[stack_pos] = binary(a_stack[stack_pos],a_stack[sp1],a_op[stack_pos]);
                }
                a_level[stack_pos] = a_level[sp1];
                a_op[stack_pos] = a_op[sp1];
            }
            //a_stack[stack_pos] = unary(a_stack[stack_pos],a_unary[stack_pos]);
            a_unary[stack_pos] = 0;
        }
        // If the level has dropped, then collapse the stack.
        else if((a_level[stack_pos] >= p_level[ip1]) && (a_op[stack_pos] < 100)){
            a_stack[stack_pos] = binary(a_stack[stack_pos],v_value[p_object[ip1]],a_op[stack_pos]);
            a_op[stack_pos] = p_binary_op[ip1];
            a_level[stack_pos] = p_level[ip1];
            // Now collapse the accumulator backwards on this level.
            // Don't smash unary operators.
            cur_level = a_level[stack_pos];
            while((stack_pos > 0) && (a_level[stack_pos-1] >= cur_level) && (a_op[stack_pos-1] < 100)){
                sp1 = stack_pos;
                stack_pos--;
                a_stack[stack_pos] = binary(a_stack[stack_pos],a_stack[sp1],a_op[stack_pos]);
                a_level[stack_pos] = a_level[sp1];
                //a_unary[stack_pos] = a_unary[sp1];
                a_op[stack_pos] = a_op[sp1];
            }
        }
        else{
            // This just puts a new layer on the stack.  We work on
            // it later.  This happens when the level increases, or if
            // there is a unary operation to be dealt with later.
            stack_pos++;
            a_stack[stack_pos] = v_value[p_object[ip1]];
            a_level[stack_pos] = p_level[ip1];
            a_unary[stack_pos] = p_unary_op[ip1];
            a_op[stack_pos] = p_binary_op[ip1];
        }
        i++;
    }
    // Collapse everything that is left
    while(stack_pos > 0){
        sp1 = stack_pos;
        stack_pos--;
        a_stack[sp1] = unary(a_stack[sp1],a_unary[sp1]);
        a_stack[stack_pos] = binary(a_stack[stack_pos],a_stack[sp1],a_op[stack_pos]);
        a_level[stack_pos] = a_level[sp1];
        //a_unary[stack_pos] = a_unary[sp1];
        a_op[stack_pos] = a_op[sp1];
    }
    a_stack[stack_pos] = unary(a_stack[stack_pos],a_unary[stack_pos]);
    return a_stack[0];
}

/*************************************
**  Determine the function that is to be applied to this group
*/
function assign_unary_op(arg){
    switch(arg) {
        case "sin":
            return 1;
        case "cos":
            return 2;
        case "tan":
            return 3;
        case "sec":
            return 4;
        case "cosec":
            return 5;
        case "cotan":
            return 6;
        case "exp":
            return 20;
        case "log":
            return 21;
        case "ln":
            return 21;
        case "sqrt":
            return 30;
        case "abs":
            return 31;
        case "step":
            return 32;
        case "heaviside":
            return 32;
        case "asin":
            return 40;
        case "acos":
            return 41;
        case "atan":
            return 42;
        case "floor":
            return 50;
        case "ceil":
            return 51;
        case "round":
            return 52;
        default:
            return 0;
    }
}

/*************************************
** Set a variable or parameter
*/
function set_variable(name,value){
    var i;
    for(i=0;i<v_value.length;i++){
        if(name == v_name[i]){
            v_value[i] = value;
        }
    }
}

/*************************************
** Perform binary operations
*/
function binary(a,b,op){
    switch(op){
        case 0:
            return setupNumber(a)+setupNumber(b);
        case 1:
            return setupNumber(a)-setupNumber(b);
        case 2:
            return setupNumber(a)*setupNumber(b);
        case 3:
            return setupNumber(a)/setupNumber(b);
        case 4:
            return Math.pow(setupNumber(a),setupNumber(b));
        case 699:
            return setupNumber(b);
        case 899:
            return 0;
        case -1:
            return 0;
    }
}

/*************************************
** Evaluate special functions
*/
function unary(a,op){
    switch(op){
        case 0:
            return a;
        case 1:
            return Math.sin(setupNumber(a));
        case 2:
            return Math.cos(setupNumber(a));
        case 3:
            return Math.tan(setupNumber(a));
        case 4:   // What do we care about dividing by zero?
            return 1/Math.cos(setupNumber(a));
        case 5:
            return 1/Math.sin(setupNumber(a));
        case 6:
            return Math.cos(setupNumber(a))/Math.sin(setupNumber(a));
        case 20:
            return Math.exp(setupNumber(a));
        case 21:
            return Math.log(setupNumber(a));
        case 30:
            return Math.sqrt(setupNumber(a));
        case 31:
            return Math.abs(setupNumber(a));
        case 32:
            if(setupNumber(a) <= 0) return Number(0);
            else return Number(1);
        case 40:
            return Math.asin(setupNumber(a));
        case 41:
            return Math.acos(setupNumber(a));
        case 42:
            return Math.atan(setupNumber(a));
        case 50:
            return Math.floor(setupNumber(a));
        case 51:
            return Math.ceil(setupNumber(a));
        case 52:
            return Math.round(setupNumber(a));
        default:
            return a;
    }
}

/*************************************
** Order numbers.  The problem is that Flash treats most
** variables as strings, and sorts lexicographically.
** By doing an arithmetic calculation, we force Flash to
** treat the numbers numerically.  The numbers will never
** be equal, so we save `if' statements by avoiding the
** test for equality.
*/
function order(a,b){
    if(b-a >= 0){
        return -1;
    }
    else{
        return 1;
    }
}

/*************************************
** Set a variable's value
*/
function set_variable_by_name(name,value){
    for(var i=0;i<v_name.length;i++){
        if(v_name[i] == name){
            v_value[i] = value;
            break;
        }
    }
}
function set_variable_by_index(index,value){
    if((index >= 0) && (index < v_name.length)){
        v_value[index] = value;
    }
}

/*************************************
** Get a variable's value
*/
function get_variable_index(name){
    for(var i=0;i<v_name.length;i++){
        if(v_name[i] == name){
            return i;
        }
    }
    return -1;
}

function calculate(expr){
    //console.log("tao_calculator entered");
    //console.log("   to process: " + expr);
    //    var calc:tao_calculator = new tao_calculator();
    tao_calculator();

    //    expr = calc.remove_space(expr);
    expr = remove_space(expr);

    //    expr = calc.prepare(expr);
    expr = prepare(expr);
    //    if (calc.preparse(expr) != 0)
    if (preparse(expr) != 0)
    {
        return("Error on parenthesis balance");
    }
    //    calc.parse (expr);
    parse(expr);
    //    var returnedResult_str = calc.evaluate();
    var returnedResult_str = evaluate();

    //console.log("   result: " + returnedResult_str);
    return(returnedResult_str);
}

// Multi country-settings number formatter -> produces standard IT numbers
//class lu.tao.tao_scoring.MyNumberFormatter{

var vPOINT;
var vCOMMA;
var vSPACE;

var normalize_data = new Object;
var ignore_whitespace;
var weak_separator_checks;
var ambiguity_detected_bool;
//var my_toolbox;

function MyNumberFormatter() {
    vPOINT = '.';
    vCOMMA = ',';
    vSPACE = ' ';
    ignore_whitespace = true;
    weak_separator_checks = true;

    normalize_data = new Object();
    normalize_data['en-US'] = {
        decimal: vPOINT,
        thousand: vCOMMA
    }; // not in Philipp's code
    normalize_data['en-AU'] = {
        decimal: vPOINT,
        thousand: vCOMMA
    };
    normalize_data['de-AT'] = {
        decimal: vCOMMA,
        thousand: vPOINT
    };
    normalize_data['tr-AT'] = {
        decimal: vCOMMA,
        thousand: vPOINT
    };
    normalize_data['sh-AT'] = {
        decimal: vCOMMA,
        thousand: vPOINT
    };
    normalize_data['nl-BE'] = {
        decimal: vCOMMA,
        thousand: vPOINT
    };
    normalize_data['en-CA'] = {
        decimal: vPOINT,
        thousand: vCOMMA
    };
    //    normalize_data['fr-CA']={decimal:vCOMMA,thousand:vSPACE};
    normalize_data['fr-CA'] = {
        decimal: vCOMMA,
        thousand: vPOINT
    };
    //    normalize_data['cs-CZ']={decimal:vCOMMA,thousand:vSPACE};
    normalize_data['cs-CZ'] = {
        decimal: vCOMMA,
        thousand: vPOINT
    };
    normalize_data['de-DE'] = {
        decimal: vCOMMA,
        thousand: vPOINT
    };
    normalize_data['da-DK'] = {
        decimal: vCOMMA,
        thousand: vPOINT
    };
    //    normalize_data['fi-FI']={decimal:vCOMMA,thousand:vSPACE};
    normalize_data['fi-FI'] = {
        decimal: vCOMMA,
        thousand: vPOINT
    };
    //    normalize_data['sv-FI']={decimal:vCOMMA,thousand:vSPACE};
    normalize_data['sv-FI'] = {
        decimal: vCOMMA,
        thousand: vPOINT
    };
    //    normalize_data['fr-FR']={decimal:vCOMMA,thousand:vSPACE};
    normalize_data['fr-FR'] = {
        decimal: vCOMMA,
        thousand: vPOINT
    };
    normalize_data['en-GB'] = {
        decimal: vPOINT,
        thousand: vCOMMA
    };
    normalize_data['cy-GB'] = {
        decimal: vPOINT,
        thousand: vCOMMA
    };
    //    normalize_data['hu-HU']={decimal:vCOMMA,thousand:vSPACE};
    normalize_data['hu-HU'] = {
        decimal: vCOMMA,
        thousand: vPOINT
    };
    normalize_data['en-IE'] = {
        decimal: vPOINT,
        thousand: vCOMMA
    };
    normalize_data['it-IT'] = {
        decimal: vCOMMA,
        thousand: vPOINT
    };
    normalize_data['ja-JP'] = {
        decimal: vPOINT,
        thousand: vCOMMA
    };
    normalize_data['ko-KR'] = {
        decimal: vPOINT,
        thousand: vCOMMA
    };
    normalize_data['nl-NL'] = {
        decimal: vCOMMA,
        thousand: vPOINT
    };
    //    normalize_data['nb-NO']={decimal:vCOMMA,thousand:vSPACE};
    normalize_data['nb-NO'] = {
        decimal: vCOMMA,
        thousand: vPOINT
    };
    normalize_data['en-NO'] = {
        decimal: vPOINT,
        thousand: vCOMMA
    };
    //    normalize_data['pl-PL']={decimal:vCOMMA,thousand:vSPACE};
    normalize_data['pl-PL'] = {
        decimal: vCOMMA,
        thousand: vPOINT
    };
    /*normalize_data['pt-PT'] = {
    decimal: vCOMMA,
    thousand: vPOINT
  };*/
    //    normalize_data['hu-SK']={decimal:vCOMMA,thousand:vSPACE};
    normalize_data['hu-SK'] = {
        decimal: vCOMMA,
        thousand: vPOINT
    };
    //    normalize_data['sk-SK']={decimal:vCOMMA,thousand:vSPACE};
    normalize_data['sk-SK'] = {
        decimal: vCOMMA,
        thousand: vPOINT
    };
    /* normalize_data['sl-SI'] = {
    decimal: vCOMMA,
    thousand: vPOINT
  };*/
    normalize_data['eu-ES'] = {
        decimal: vCOMMA,
        thousand: vPOINT
    };
    normalize_data['ca-ES'] = {
        decimal: vCOMMA,
        thousand: vPOINT
    };
    normalize_data['es-ES'] = {
        decimal: vCOMMA,
        thousand: vPOINT
    };
    normalize_data['gl-ES'] = {
        decimal: vCOMMA,
        thousand: vPOINT
    };
    normalize_data['xa-ES'] = {
        decimal: vPOINT,
        thousand: vCOMMA
    };
    //    normalize_data['sv-SE']={decimal:vCOMMA,thousand:vSPACE};
    normalize_data['sv-SE'] = {
        decimal: vCOMMA,
        thousand: vPOINT
    };
    normalize_data['en-UX'] = {
        decimal: vPOINT,
        thousand: vCOMMA
    };
    normalize_data['es-UX'] = {
        decimal: vCOMMA,
        thousand: vPOINT
    };
    //    normalize_data['et-EE']={decimal:vCOMMA,thousand:vSPACE};
    normalize_data['et-EE'] = {
        decimal: vCOMMA,
        thousand: vPOINT
    };
    //    normalize_data['ru-EE']={decimal:vCOMMA,thousand:vSPACE};
    normalize_data['ru-EE'] = {
        decimal: vCOMMA,
        thousand: vPOINT
    };
    normalize_data['mt-MT'] = {
        decimal: vPOINT,
        thousand: vCOMMA
    };
    /*normalize_data['es-CL'] = {
    decimal: vCOMMA,
    thousand: vPOINT
  };*/
    normalize_data['el-CY'] = {
        decimal: vCOMMA,
        thousand: vPOINT
    };
    //    normalize_data['ru-RU']={decimal:vCOMMA,thousand:vSPACE};
    normalize_data['ru-RU'] = {
        decimal: vCOMMA,
        thousand: vPOINT
    };
  
    normalize_data['en-ZZ'] = {
        decimal: vCOMMA,
        thousand: vPOINT
    };
    normalize_data['eng-ZZZ'] = {
        decimal: vCOMMA,
        thousand: vPOINT
    };
    ////////////////////////////////////////////////////// piaac r2 languages
    normalize_data['el-GR'] = {//greece
        decimal: vCOMMA,
        thousand: vPOINT
    };
    normalize_data['id-ID'] = {//indonesia
        decimal: vCOMMA,
        thousand: vPOINT
    };
    normalize_data['he-IL'] = {//israel
        decimal: vPOINT,
        thousand: vCOMMA
    };
    normalize_data['ar-IL'] = {
        decimal: vPOINT,
        thousand: vCOMMA
    };
    normalize_data['ru-IL'] = {
        decimal: vPOINT,
        thousand: vCOMMA
    };
    normalize_data['lt-LT'] = {//lituania
        decimal: vCOMMA,
        thousand: vSPACE
    };
    normalize_data['en-NZ'] = {//new zealand
        decimal: vPOINT,
        thousand: vCOMMA
    };
    normalize_data['en-SG'] = {//singapore
        decimal: vPOINT,
        thousand: vCOMMA
    };
    normalize_data['zh-SG'] = {//singapore
        decimal: vPOINT,
        thousand: vCOMMA
    };
    normalize_data['tr-TR'] = {//turkey
        decimal: vCOMMA,
        thousand: vPOINT
    };
    normalize_data['pt-PT'] = {//portugal
        decimal: vSPACE,
        thousand: vSPACE
    };
    normalize_data['es-CL'] = {//chile
        decimal: vSPACE,
        thousand: vPOINT
    };
    normalize_data['sl-SI'] = {//slovenia
        decimal: vCOMMA,
        thousand: vPOINT
    };
    normalize_data['es-AR'] = {//argentina
        decimal: vCOMMA,
        thousand: vPOINT
    };
    normalize_data['es-MX'] = {//mexico
        decimal: vCOMMA,
        thousand: vPOINT
    };
//  my_toolbox = new tao_toolbox();
}

/**
* @param bool enabled default is true.
*/
function setIgnoreWhitespace(enabled_bool) {
    ignore_whitespace = (enabled_bool === true);
}

/**
* @param bool enabled default is true.
*/
function setWeakSeparatorChecks(enabled_bool) {
    weak_separator_checks = (enabled_bool === true);
}

/**
* Filter all whitespace characters from given string.
*/
function filterWhitespace(string_str) {
    //    search = array(' ', '\t', '\n', '\r', '\0', '\x0B');
    //    return(str_replace(search, array(''), string));
    return(cleanString(string_str, true, true, true, true));
}

/**
* @param string number_str input.
* @param string locale_str supported locale.
* @return string normalized input or error message starting with 'Error'.
*/
function normalize(number_str, locale_str) {
    //console.log("CPLX IN  normalize with number_str = '" + number_str + "' and locale_str = '" + locale_str + "'");
    ambiguity_detected_bool = false;
    var vReturn_str = "";
    if(strlen(number_str) == 0) {
        return 'Error: empty input string for number.';
    }
    if(strlen(locale_str) == 0) {
        return 'Error: empty input string for locale.';
    }
    if(array_key_exists(locale_str, normalize_data) == false) {
        //return 'Error: unknown locale.';
        locale_str = 'eng-ZZZ';
    }

    number_str = trim(number_str);
    if(ignore_whitespace == true) {
        number_str = filterWhitespace(number_str);
    }

    //    //console.log("CPLX     normalize with strpos(number_str, '-') = '" + strpos(number_str, '-') + "'");
    var is_neg = (strpos(number_str, '-') === 0);
    //console.log("CPLX     normalize with is_neg = " + is_neg);
    if(is_neg == true) {
        number_str = substr(number_str, 1);
    }
    number_str = ltrim(number_str); // remove possible whitespace behind minus
    if(strlen(number_str) == 0) {
        return 'Error: empty string after removing minus.';
    }

    var separators = normalize_data[locale_str];
    var decimal_sep = separators.decimal;
    var thousand_sep = separators.thousand;
    //console.log("CPLX     normalize with decimal_sep = '" + decimal_sep + "' and thousand_sep = '" + thousand_sep + "'");

    var integral_part = number_str;
    var fractional_part = '0';

    var decimal_sep_pos = strpos(number_str, decimal_sep);
    var thousand_sep_pos = strpos(number_str, thousand_sep);

    if((decimal_sep_pos !== false) && (thousand_sep_pos !== false)) {
        if(decimal_sep_pos < thousand_sep_pos) {
            decimal_sep = separators.thousand;
            thousand_sep = separators.decimal;
            decimal_sep_pos = strpos(number_str, decimal_sep);
            thousand_sep_pos = strpos(number_str, thousand_sep);
        //console.log("CPLX     normalize inversion of separator decimal_sep = '" + decimal_sep + "' and thousand_sep = '" + thousand_sep + "'");
        }
        if(strrpos(number_str, thousand_sep) > decimal_sep_pos) {
            return 'Error: mismatch with overlapping separators.';
        }
    }
    else {
        var tmpSecondPart_str = "";
        var number_of_chunks = new Array();
        if(decimal_sep_pos !== false) {
            number_of_chunks = explode(decimal_sep, number_str);
            if(count(number_of_chunks) > 2) {
                decimal_sep = separators.thousand;
                thousand_sep = separators.decimal;
                decimal_sep_pos = strpos(number_str, decimal_sep);
                thousand_sep_pos = strpos(number_str, thousand_sep);
            //console.log("CPLX     normalize inversion of separator decimal_sep = '" + decimal_sep + "' and thousand_sep = '" + thousand_sep + "'");
            }
            else {
                tmpSecondPart_str = "" + number_of_chunks[1];
                if(((locale_str == "ja-JP") && ((tmpSecondPart_str.length % 4) == 0)) || ((tmpSecondPart_str.length % 3) == 0)) {
                    // AMBIGUITY
                    decimal_sep = separators.thousand;
                    thousand_sep = separators.decimal;
                    decimal_sep_pos = strpos(number_str, decimal_sep);
                    thousand_sep_pos = strpos(number_str, thousand_sep);
                    ambiguity_detected_bool = true;
                //console.log("CPLX     normalize AMBIGUITY inversion of separator decimal_sep = '" + decimal_sep + "' and thousand_sep = '" + thousand_sep + "'");
                }
            }
        }
        else {
            number_of_chunks = explode(thousand_sep, number_str);
            if(count(number_of_chunks) == 2) {
                tmpSecondPart_str = "" + number_of_chunks[1];
                if(((locale_str == "ja-JP") && ((tmpSecondPart_str.length % 4) == 0)) || ((tmpSecondPart_str.length % 3) == 0)) {
                    // AMBIGUITY
                    ambiguity_detected_bool = true;
                //console.log("CPLX     normalize with AMBIGUITY");
                }
                else {
                    decimal_sep = separators.thousand;
                    thousand_sep = separators.decimal;
                    decimal_sep_pos = strpos(number_str, decimal_sep);
                    thousand_sep_pos = strpos(number_str, thousand_sep);
                //console.log("CPLX     normalize inversion of separator decimal_sep = '" + decimal_sep + "' and thousand_sep = '" + thousand_sep + "'");
                }
            }
        }
    }

    var vTmpResult_str = test_num_expr(number_str, thousand_sep, decimal_sep, locale_str);
    if(!isNaN(vTmpResult_str)) {
        vTmpResult_str = ((is_neg) ? '-' : '') + vTmpResult_str;
        vReturn_str = vTmpResult_str;
    }
    //console.log("CPLX     num_fmt_analyze OUT 1 with vTmpResult_str = " + vTmpResult_str);
    if(ambiguity_detected_bool) {
        vTmpResult_str = test_num_expr(number_str, decimal_sep, thousand_sep, locale_str);
        if(!isNaN(vTmpResult_str)) {
            vTmpResult_str = ((is_neg) ? '-' : '') + vTmpResult_str;
        }
        //console.log("CPLX     num_fmt_analyze OUT 2 with vTmpResult_str = " + vTmpResult_str);
        vReturn_str = (vReturn_str == "") ? vTmpResult_str : vTmpResult_str + ';' + vReturn_str;
    }

    //console.log("CPLX OUT normalize with vReturn_str = '" + vReturn_str + "'");
    return(vReturn_str);
}

function test_num_expr(arg_number_str, arg_thousand_sep, arg_decimal_sep, arg_locale_str) {
    //console.log("CPLX     test_num_expr entered with arg_number_str = " + arg_number_str + " and params:" + arg_thousand_sep + arg_decimal_sep + arg_locale_str);
    var local_integral_part = arg_number_str;
    var local_fractional_part = '0';
    var local_decimal_sep_pos = strpos(arg_number_str, arg_decimal_sep);
    var local_thousand_sep_pos = strpos(arg_number_str, arg_thousand_sep);

    if(num_fmt_analyze(arg_number_str, arg_thousand_sep, arg_decimal_sep, arg_locale_str) == false) {
        return 'Error: numeric format is incorrect.';
    }

    if(local_decimal_sep_pos !== false) {
        var local_number_str_chunks = explode(arg_decimal_sep, arg_number_str);

        if(count(local_number_str_chunks) != 2) {
            return 'Error: too many decimal separators.';
        }
        local_integral_part = local_number_str_chunks[0];
        local_fractional_part = local_number_str_chunks[1];
        //console.log("CPLX     normalize with local_integral_part = '" + local_integral_part + "' and local_fractional_part = '" + local_fractional_part + "'");

        if(ctype_digit(local_fractional_part) == false) {
            return 'Error: garbage in fractional part.';
        }
        local_fractional_part = rtrim(local_fractional_part, '0');
        if(strlen(local_fractional_part) == 0) {
            // removed to much from end
            local_fractional_part = '0';
        }
    }
    local_integral_part = str_replace(arg_thousand_sep, '', local_integral_part);
    local_integral_part = ltrim(local_integral_part, '0');
    if(strlen(local_integral_part) == 0) {
        // removed to much from beginning
        local_integral_part = '0';
    }
    return(local_integral_part + "." + local_fractional_part);
}

function num_fmt_analyze(arg_number_str, arg_thousand_sep, arg_decimal_sep, arg_locale_str) {
    //console.log("CPLX     num_fmt_analyze entered with arg_number_str = " + arg_number_str + " and params:" + arg_thousand_sep + arg_decimal_sep + arg_locale_str);
    var index_pos = arg_number_str.length;
    var vResult_bool = true;
    var vResult_str = "";
    var vCptDigits_num = 0;
    var vThousandMarker_ja_JP_num = 0;
    for(var vCpt_num = arg_number_str.length - 1; vCpt_num >= 0; vCpt_num--) {
        //      //console.log("CPLX     num_fmt_analyze digit(" + vCpt_num + ") is '" + arg_number_str.substr(vCpt_num,1) + "' and vResult_str = '" + vResult_str + "'");
        switch(true) {
            case (arg_number_str.substr(vCpt_num, 1) == arg_thousand_sep): {
                vResult_str = "t" + String(vCptDigits_num) + vResult_str;
                if(arg_locale_str == "ja-JP") {
                    switch(true) {
                        case (((vCptDigits_num % 3) == 0) && ((vCptDigits_num % 4) == 0) && (vCptDigits_num != 0)): {
                            break;
                        }
                        case (((vCptDigits_num % 3) == 0) && ((vCptDigits_num % 4) != 0)): {
                            if((vThousandMarker_ja_JP_num == 0) || (vThousandMarker_ja_JP_num == 3)) {
                                vThousandMarker_ja_JP_num = 3;
                            }
                            else {
                                vResult_bool = false;
                            }
                            break;
                        }
                        case (((vCptDigits_num % 3) != 0) && ((vCptDigits_num % 4) == 0)): {
                            if((vThousandMarker_ja_JP_num == 0) || (vThousandMarker_ja_JP_num == 4)) {
                                vThousandMarker_ja_JP_num = 4;
                            }
                            else {
                                vResult_bool = false;
                            }
                            break;
                        }
                        default : {
                            vResult_bool = false;
                        }
                    }
                }
                else {
                    if(((vCptDigits_num % 3) != 0) || (vCptDigits_num == 0)) {
                        vResult_bool = false;
                    }
                }
                vCptDigits_num = 0;
                break;
            }
            case (arg_number_str.substr(vCpt_num, 1) == arg_decimal_sep): {
                vResult_str = "d" + String(vCptDigits_num) + vResult_str;
                vCptDigits_num = 0;
                break;
            }
            case (isNaN(parseInt(arg_number_str.substr(vCpt_num, 1), 10)) == false): {
                vCptDigits_num++;
                break;
            }
            default : {
                // nothing to do - blank space!
                }
        }
    }
    vResult_str = String(vCptDigits_num) + vResult_str;
    //console.log("CPLX     num_fmt_analyze with vResult_str = " + vResult_str + " and vResult_bool = " + vResult_bool);
    return vResult_bool;
}

function array_key_exists(vArg, vObject) {
    var vResult_bool = false;
    if(vObject[vArg] != undefined) {
        vResult_bool = true;
    }
    return(vResult_bool);
}

function strlen(vArg) {
    var vWork_str = (vArg);
    return(vWork_str.length);
}

function trim(vArg, vMask) {
    return(trimStringMask(vArg, ((vMask == undefined) ? " " : vMask), "BOTH"));
}

function ltrim(vArg, vMask) {
    return(trimStringMask(vArg, ((vMask == undefined) ? " " : vMask), "LEFT"));
}

function rtrim(vArg, vMask) {
    return(trimStringMask(vArg, ((vMask == undefined) ? " " : vMask), "RIGHT"));
}

function strpos(hay_str, needle_str) {
    var vWork_num = hay_str.indexOf(needle_str);
    var vResult = (vWork_num == -1) ? false : vWork_num;
    return(vResult);
}

function strrpos(hay_str, needle_str) {
    var vWork_num = hay_str.lastIndexOf(needle_str);
    var vResult = (vWork_num == -1) ? false : vWork_num;
    return(vResult);
}

function str_replace(target_str, replacer_str, source_str) {
    return(replaceString(source_str, target_str, replacer_str));
}

function substr(string_str, pos_num) {
    return(string_str.substr(pos_num));
}

function implode(vArray) {
    return(vArray.join());
}

function explode(separator_str, string_str) {
    var vResult_array = new Array();
    vResult_array = string_str.split(separator_str);
    return(vResult_array);
}

function count(vArray) {
    return(vArray.length);
}

function ctype_digit(vArg) {
    //console.log("CPLX IN  ctype_digit with vArg = " + vArg);
    var vResult_bool = true;
    var vArg_array = new Array();
    vArg_array = String(vArg).split("");
    for(var vCpt_num = 0; vCpt_num < vArg_array.length; vCpt_num++) {
        if(isNaN(vArg_array[vCpt_num])) {
            vResult_bool = false;
            break;
        }
    }
    //console.log("CPLX OUT ctype_digit with vResult_bool = " + vResult_bool);
    return(vResult_bool);
}

// Here starts the tricky part - Complex scoring
//class lu.tao.tao_scoring.tao_COMPLEX{

var vFinalExpression_str;
var tokenArray_array;
var wgtsRepo_array;
var scoreType_str;
//var my_toolbox;
//var my_formatter;
var vIdxChar_num;
var keyWords_array = new Array();
var targetPointers_array = new Array();

var pcSetResult;
var isWSDLok;
var wsdlurl_str;
var followUpCallFct_str;
var localizationLog;
var localizationService;

function tao_COMPLEX(widgetValueArray, scoreType) {
    // constructor
    vFinalExpression_str = "";
    tokenArray_array = new Array();
    wgtsRepo_array = widgetValueArray;
    scoreType_str = scoreType;
    //  my_toolbox = new tao_toolbox();
    //  my_formatter = new MyNumberFormatter();
    MyNumberFormatter();
    vIdxChar_num = 0;
    keyWords_array = new Array();
    keyWords_array.push("PARSEINT");
    keyWords_array.push("PARSEFLOAT");
    keyWords_array.push("PARSEFRACT");
    keyWords_array.push("TRIMSTRING");
    keyWords_array.push("CLEANSTRINGMASK");
    keyWords_array.push("CLEANSTRING");
    keyWords_array.push("FILTERSTRING");
}

function scoreThis(endorsement_str) {
    //console.log("CPLX IN  scoreThis with " + endorsement_str);
    endorsement_str = tokenizeComplex(endorsement_str);
    //console.log("CPLX     scoreThis endorsement_str (tokenized) = " + endorsement_str);
    endorsement_str = cleanString(endorsement_str, true, true, true, true);
    endorsement_str = replaceString(endorsement_str, "{", "(");
    endorsement_str = replaceString(endorsement_str, "}", ")");
    //console.log("CPLX     scoreThis scoreType_str = " + scoreType_str);
    if(scoreType_str == "MATCH") {
        endorsement_str = transmuteString(endorsement_str, "==", ",", "(", "MATCH(");
        endorsement_str = transmuteString(endorsement_str, "!=", "$", "(", "MATCH(");
        endorsement_str = transmuteString(endorsement_str, "<>", "$", "(", "MATCH(");
    }
    //console.log("CPLX     scoreThis endorsement_str (ready) = " + endorsement_str);
    var final_str = resolveComplex(endorsement_str, wgtsRepo_array);
    var vCptParentheses_num = 0;
    for(var vCpt_num = 0; vCpt_num < final_str.length; vCpt_num++) {
        if(final_str.charAt(vCpt_num) == "(") {
            vCptParentheses_num++;
        }
        if(final_str.charAt(vCpt_num) == ")") {
            vCptParentheses_num--;
        }
    }
    if(vCptParentheses_num > 0) {
        final_str = format(final_str, ")", final_str.length + vCptParentheses_num, "RIGHTPAD");
    }
    if(vCptParentheses_num < 0) {
        final_str = format(final_str, "(", final_str.length - vCptParentheses_num, "LEFTPAD");
    }
    final_str = replaceString(final_str, "true", "t");
    final_str = replaceString(final_str, "false", "f");
    final_str = replaceString(final_str, "&&", "&");
    final_str = replaceString(final_str, "||", "|");
    // final_str = "(f|((t&(f)))|f)"; // for testing purpose
    //console.log("CPLX     scoreThis mid-term result = " + final_str);
    vFinalExpression_str = final_str;
    //var finalResult_bool = evalComplex(final_str);
    var finalResult_bool = parseComplex(final_str);
    //console.log("CPLX OUT scoreThis with result bool = " + finalResult_bool);
    return(finalResult_bool);
}

function LOCAL_PARSEINT() {
    var args = arguments[0];
    var vInitial = getWidgetValue(args[0]);
    //console.log("CPLX IN  localPARSEINT with " + vInitial);
    var vResult_str = "";
    vInitial = formatNumber(vInitial);
    vResult_str = String(parseInt(vInitial, 10));
    //console.log("CPLX OUT localPARSEINT with " + vResult_str);
    return(vResult_str);
}

function LOCAL_PARSEFLOAT() {
    var args = arguments[0];
    var vInitial = getWidgetValue(args[0]);
    //console.log("CPLX IN  localPARSEFLOAT with " + vInitial);
    var vResult_str = "";
    vInitial = formatNumber(vInitial);
    vResult_str = String(parseFloat(vInitial));
    //console.log("CPLX OUT localPARSEFLOAT with " + vResult_str);
    return(vResult_str);
}

function LOCAL_PARSEFRACT() {
    var args = arguments[0];
    var vInitial = getWidgetValue(args[0]);
    var vWork1_str = vInitial;
    var vWork2_str = "";
    var vSlashPos_num;
    var vBlankPos_num;
    //console.log("CPLX IN  localPARSEFRACT with " + vInitial);
    var vResult_str = "";
    var langCountryCode_str = ((lgCO_locale == undefined) || (lgCO_locale == "")) ? "en-US" : lgCO_locale; //fallback
    //    vResult_str = String(parseFloat(vInitial));
    vWork1_str = trimString(vWork1_str, true, true);

    while(true) {
        vWork2_str = replaceString(vWork1_str, " /", "/");
        if(vWork1_str == vWork2_str) {
            break;
        }
        else {
            vWork1_str = vWork2_str;
        }
    }
    vWork2_str = "";
    while(true) {
        vWork2_str = replaceString(vWork1_str, "/ ", "/");
        if(vWork1_str == vWork2_str) {
            break;
        }
        else {
            vWork1_str = vWork2_str;
        }
    }
    vSlashPos_num = vWork1_str.indexOf("/");
    if(vSlashPos_num != -1) {
        vBlankPos_num = vWork1_str.lastIndexOf(" ", vSlashPos_num);
        var numerator_str = "";
        var denominator_str = "";
        var arg_number_str = "";
        if(vBlankPos_num != -1) {
            var vSign_str = "+";
            var vPrefix_str = vWork1_str.substr(0, vBlankPos_num);
            var vSignPosMin_num = vPrefix_str.lastIndexOf("-");
            var vSignPosPlus_num = vPrefix_str.lastIndexOf("+");
            if(vSignPosMin_num != -1) {
                if(vSignPosPlus_num != -1) {
                    vSign_str = (vSignPosMin_num > vSignPosPlus_num) ? "-" : "+";
                }
                else {
                    vSign_str = "-";
                }
            }
            var num1_sep_comma_bool = false;
            var num1_sep_point_bool = false;
            var num2_sep_comma_bool = false;
            var num2_sep_point_bool = false;
            var deno_sep_comma_bool = false;
            var deno_sep_point_bool = false;

            var numerator_p1_str = vPrefix_str;
            var numerator_p2_str = vWork1_str.substring(vBlankPos_num + 1, vSlashPos_num);
            denominator_str = vWork1_str.substr(vSlashPos_num + 1);

            num1_sep_comma_bool = (numerator_p1_str.indexOf(',') != -1);
            num1_sep_point_bool = (numerator_p1_str.indexOf('.') != -1);
            num2_sep_comma_bool = (numerator_p2_str.indexOf(',') != -1);
            num2_sep_point_bool = (numerator_p2_str.indexOf('.') != -1);
            deno_sep_comma_bool = (denominator_str.indexOf(',') != -1);
            deno_sep_point_bool = (denominator_str.indexOf('.') != -1);
            if((num1_sep_comma_bool && num1_sep_point_bool) || (num2_sep_comma_bool && num2_sep_point_bool) || (deno_sep_comma_bool && deno_sep_point_bool)) {
                vResult_str = "ERROR: separators type mismatch!";
            }
            if((num1_sep_comma_bool && (num2_sep_point_bool || deno_sep_point_bool)) || (num1_sep_point_bool && (num2_sep_comma_bool || deno_sep_comma_bool)) || (num2_sep_comma_bool && (num1_sep_point_bool || deno_sep_point_bool)) || (num2_sep_point_bool && (num1_sep_comma_bool || deno_sep_comma_bool)) || (deno_sep_comma_bool && (num1_sep_point_bool || num2_sep_point_bool)) || (deno_sep_point_bool && (num1_sep_comma_bool || num2_sep_comma_bool))) {
                vResult_str = "ERROR: separators type mismatch!";
            }
            var vCptDigits_num = 0;
            var vGroupedBy3_bool = false;
            var vGroupedBy4_bool = false;
            if(vResult_str == "") {
                for(var vCpt_num = numerator_p1_str.length - 1; vCpt_num >= 0; vCpt_num--) {
                    arg_number_str = numerator_p1_str.substr(vCpt_num, 1);
                    switch(true) {
                        case ((arg_number_str == ',') || (arg_number_str == '.')): {
                            if(vCptDigits_num != 0) {
                                switch(true) {
                                    case ((vCptDigits_num % 3) == 0): {
                                        vCptDigits_num = 0;
                                        if(vGroupedBy4_bool) {
                                            if((vCptDigits_num % 4) != 0) {
                                                vResult_str = "ERROR: thousand separators mismatch!";
                                            }
                                        }
                                        else {
                                            if((vCptDigits_num % 4) != 0) {
                                                vGroupedBy3_bool = true;
                                            }
                                        }
                                        break;
                                    }
                                    case ((vCptDigits_num % 4) == 0): {
                                        vCptDigits_num = 0;
                                        if(vGroupedBy3_bool) {
                                            if((vCptDigits_num % 3) != 0) {
                                                vResult_str = "ERROR: thousand separators mismatch!";
                                            }
                                        }
                                        else {
                                            vGroupedBy4_bool = true;
                                            if((langCountryCode_str != "ja-JP") && ((vCptDigits_num % 3) != 0)) {
                                                vResult_str = "ERROR: improper thousand separator place for country code!";
                                            }
                                        }
                                        break;
                                    }
                                    default : {
                                        vResult_str = "ERROR: improper thousand separator place!";
                                    }
                                }
                            }
                            else {
                                vResult_str = "ERROR: improper thousand separator place!";
                            }
                            vCptDigits_num = 0;
                            break;
                        }
                        case (isNaN(parseInt(arg_number_str, 10)) == false): {
                            vCptDigits_num++;
                            break;
                        }
                        default : {
                            // nothing to do - blank space!
                            }
                    }
                    if(vResult_str != "") {
                        break;
                    }
                }
            }
            vCptDigits_num = 0;
            vGroupedBy3_bool = false;
            vGroupedBy4_bool = false;
            if(vResult_str == "") {
                for(var vCpt_num = numerator_p2_str.length - 1; vCpt_num >= 0; vCpt_num--) {
                    arg_number_str = numerator_p2_str.substr(vCpt_num, 1);
                    switch(true) {
                        case ((arg_number_str == ',') || (arg_number_str == '.')): {
                            if(vCptDigits_num != 0) {
                                switch(true) {
                                    case ((vCptDigits_num % 3) == 0): {
                                        vCptDigits_num = 0;
                                        if(vGroupedBy4_bool) {
                                            if((vCptDigits_num % 4) != 0) {
                                                vResult_str = "ERROR: thousand separators mismatch!";
                                            }
                                        }
                                        else {
                                            if((vCptDigits_num % 4) != 0) {
                                                vGroupedBy3_bool = true;
                                            }
                                        }
                                        break;
                                    }
                                    case ((vCptDigits_num % 4) == 0): {
                                        vCptDigits_num = 0;
                                        if(vGroupedBy3_bool) {
                                            if((vCptDigits_num % 3) != 0) {
                                                vResult_str = "ERROR: thousand separators mismatch!";
                                            }
                                        }
                                        else {
                                            vGroupedBy4_bool = true;
                                            if((langCountryCode_str != "ja-JP") && ((vCptDigits_num % 3) != 0)) {
                                                vResult_str = "ERROR: improper thousand separator place for country code!";
                                            }
                                        }
                                        break;
                                    }
                                    default : {
                                        vResult_str = "ERROR: improper thousand separator place!";
                                    }
                                }
                            }
                            else {
                                vResult_str = "ERROR: improper thousand separator place!";
                            }
                            vCptDigits_num = 0;
                            break;
                        }
                        case (isNaN(parseInt(arg_number_str, 10)) == false): {
                            vCptDigits_num++;
                            break;
                        }
                        default : {
                            // nothing to do - blank space!
                            }
                    }
                    if(vResult_str != "") {
                        break;
                    }
                }
            }
            vCptDigits_num = 0;
            vGroupedBy3_bool = false;
            vGroupedBy4_bool = false;
            if(vResult_str == "") {
                for(var vCpt_num = denominator_str.length - 1; vCpt_num >= 0; vCpt_num--) {
                    arg_number_str = denominator_str.substr(vCpt_num, 1);
                    switch(true) {
                        case ((arg_number_str == ',') || (arg_number_str == '.')): {
                            if(vCptDigits_num != 0) {
                                switch(true) {
                                    case ((vCptDigits_num % 3) == 0): {
                                        vCptDigits_num = 0;
                                        if(vGroupedBy4_bool) {
                                            if((vCptDigits_num % 4) != 0) {
                                                vResult_str = "ERROR: thousand separators mismatch!";
                                            }
                                        }
                                        else {
                                            if((vCptDigits_num % 4) != 0) {
                                                vGroupedBy3_bool = true;
                                            }
                                        }
                                        break;
                                    }
                                    case ((vCptDigits_num % 4) == 0): {
                                        vCptDigits_num = 0;
                                        if(vGroupedBy3_bool) {
                                            if((vCptDigits_num % 3) != 0) {
                                                vResult_str = "ERROR: thousand separators mismatch!";
                                            }
                                        }
                                        else {
                                            vGroupedBy4_bool = true;
                                            if((langCountryCode_str != "ja-JP") && ((vCptDigits_num % 3) != 0)) {
                                                vResult_str = "ERROR: improper thousand separator place for country code!";
                                            }
                                        }
                                        break;
                                    }
                                    default : {
                                        vResult_str = "ERROR: improper thousand separator place!";
                                    }
                                }
                            }
                            else {
                                vResult_str = "ERROR: improper thousand separator place!";
                            }
                            vCptDigits_num = 0;
                            break;
                        }
                        case (isNaN(parseInt(arg_number_str, 10)) == false): {
                            vCptDigits_num++;
                            break;
                        }
                        default : {
                            // nothing to do - blank space!
                            }
                    }
                    if(vResult_str != "") {
                        break;
                    }
                }
            }
            if(vResult_str == "") {
                numerator_p1_str = replaceString(numerator_p1_str, '.', '');
                numerator_p1_str = replaceString(numerator_p1_str, ',', '');
                numerator_p1_str = formatNumber(numerator_p1_str);
                numerator_p2_str = replaceString(numerator_p2_str, '.', '');
                numerator_p2_str = replaceString(numerator_p2_str, ',', '');
                numerator_p2_str = formatNumber(numerator_p2_str);
                denominator_str = replaceString(denominator_str, '.', '');
                denominator_str = replaceString(denominator_str, ',', '');
                denominator_str = formatNumber(denominator_str);
                vWork1_str = numerator_p1_str + vSign_str + numerator_p2_str + "/" + denominator_str;
                vResult_str = calculate(vWork1_str);
            //console.log("CPLX ->  localPARSEFRACT with work=" + vWork1_str + " = " + vResult_str);
            }
        }
        else {
            var num2_sep_comma_bool = false;
            var num2_sep_point_bool = false;
            var deno_sep_comma_bool = false;
            var deno_sep_point_bool = false;

            numerator_str = vWork1_str.substring(0, vSlashPos_num);
            denominator_str = vWork1_str.substr(vSlashPos_num + 1);

            num2_sep_comma_bool = (numerator_str.indexOf(',') != -1);
            num2_sep_point_bool = (numerator_str.indexOf('.') != -1);
            deno_sep_comma_bool = (denominator_str.indexOf(',') != -1);
            deno_sep_point_bool = (denominator_str.indexOf('.') != -1);
            if((num2_sep_comma_bool && num2_sep_point_bool) || (deno_sep_comma_bool && deno_sep_point_bool)) {
                vResult_str = "ERROR: separators type mismatch!";
            }
            if((num2_sep_comma_bool && deno_sep_point_bool) || (num2_sep_point_bool && deno_sep_comma_bool)) {
                vResult_str = "ERROR: separators type mismatch!";
            }
            var vCptDigits_num = 0;
            var vGroupedBy3_bool = false;
            var vGroupedBy4_bool = false;
            if(vResult_str == "") {
                for(var vCpt_num = numerator_str.length - 1; vCpt_num >= 0; vCpt_num--) {
                    arg_number_str = numerator_str.substr(vCpt_num, 1);
                    switch(true) {
                        case ((arg_number_str == ',') || (arg_number_str == '.')): {
                            if(vCptDigits_num != 0) {
                                switch(true) {
                                    case ((vCptDigits_num % 3) == 0): {
                                        vCptDigits_num = 0;
                                        if(vGroupedBy4_bool) {
                                            if((vCptDigits_num % 4) != 0) {
                                                vResult_str = "ERROR: thousand separators mismatch!";
                                            }
                                        }
                                        else {
                                            if((vCptDigits_num % 4) != 0) {
                                                vGroupedBy3_bool = true;
                                            }
                                        }
                                        break;
                                    }
                                    case ((vCptDigits_num % 4) == 0): {
                                        vCptDigits_num = 0;
                                        if(vGroupedBy3_bool) {
                                            if((vCptDigits_num % 3) != 0) {
                                                vResult_str = "ERROR: thousand separators mismatch!";
                                            }
                                        }
                                        else {
                                            vGroupedBy4_bool = true;
                                            if((langCountryCode_str != "ja-JP") && ((vCptDigits_num % 3) != 0)) {
                                                vResult_str = "ERROR: improper thousand separator place for country code!";
                                            }
                                        }
                                        break;
                                    }
                                    default : {
                                        vResult_str = "ERROR: improper thousand separator place!";
                                    }
                                }
                            }
                            else {
                                vResult_str = "ERROR: improper thousand separator place!";
                            }
                            vCptDigits_num = 0;
                            break;
                        }
                        case (isNaN(parseInt(arg_number_str, 10)) == false): {
                            vCptDigits_num++;
                            break;
                        }
                        default : {
                            // nothing to do - blank space!
                            }
                    }
                    if(vResult_str != "") {
                        break;
                    }
                }
            }
            vCptDigits_num = 0;
            vGroupedBy3_bool = false;
            vGroupedBy4_bool = false;
            if(vResult_str == "") {
                for(var vCpt_num = denominator_str.length - 1; vCpt_num >= 0; vCpt_num--) {
                    arg_number_str = denominator_str.substr(vCpt_num, 1);
                    switch(true) {
                        case ((arg_number_str == ',') || (arg_number_str == '.')): {
                            if(vCptDigits_num != 0) {
                                switch(true) {
                                    case ((vCptDigits_num % 3) == 0): {
                                        vCptDigits_num = 0;
                                        if(vGroupedBy4_bool) {
                                            if((vCptDigits_num % 4) != 0) {
                                                vResult_str = "ERROR: thousand separators mismatch!";
                                            }
                                        }
                                        else {
                                            if((vCptDigits_num % 4) != 0) {
                                                vGroupedBy3_bool = true;
                                            }
                                        }
                                        break;
                                    }
                                    case ((vCptDigits_num % 4) == 0): {
                                        vCptDigits_num = 0;
                                        if(vGroupedBy3_bool) {
                                            if((vCptDigits_num % 3) != 0) {
                                                vResult_str = "ERROR: thousand separators mismatch!";
                                            }
                                        }
                                        else {
                                            vGroupedBy4_bool = true;
                                            if((langCountryCode_str != "ja-JP") && ((vCptDigits_num % 3) != 0)) {
                                                vResult_str = "ERROR: improper thousand separator place for country code!";
                                            }
                                        }
                                        break;
                                    }
                                    default : {
                                        vResult_str = "ERROR: improper thousand separator place!";
                                    }
                                }
                            }
                            else {
                                vResult_str = "ERROR: improper thousand separator place!";
                            }
                            vCptDigits_num = 0;
                            break;
                        }
                        case (isNaN(parseInt(arg_number_str, 10)) == false): {
                            vCptDigits_num++;
                            break;
                        }
                        default : {
                            // nothing to do - blank space!
                            }
                    }
                    if(vResult_str != "") {
                        break;
                    }
                }
            }
            if(vResult_str == "") {
                numerator_str = replaceString(numerator_str, '.', '');
                numerator_str = replaceString(numerator_str, ',', '');
                numerator_str = formatNumber(numerator_str);
                denominator_str = replaceString(denominator_str, '.', '');
                denominator_str = replaceString(denominator_str, ',', '');
                denominator_str = formatNumber(denominator_str);
                vWork1_str = numerator_str + "/" + denominator_str;
                vResult_str = calculate(vWork1_str);
            //console.log("CPLX ->  localPARSEFRACT with work=" + vWork1_str + " = " + vResult_str);
            }
        }
    }
    else {
        vWork1_str = formatNumber(vWork1_str);
        vWork1_str = cleanString(vWork1_str, true, true, true, true);
        //console.log("CPLX ->  localPARSEFRACT with work=" + vWork1_str);
        vResult_str = calculate(vWork1_str);
    }
    //console.log("CPLX OUT localPARSEFRACT with " + vResult_str);
    return(vResult_str);
}

function LOCAL_TRIMSTRING() {
    var args = arguments[0];
    var vInitial = getWidgetValue(args[0]);
    var vMask = args[1];
    var vLeftRight = args[2];
    //console.log("CPLX IN  localTRIMSTRING with vInitial: " + vInitial + " and vMask: " + vMask + " and vLeftRight: " + vLeftRight);
    var vResult_str = "";
    vResult_str = trimStringMask(vInitial, vMask, vLeftRight);
    //console.log("CPLX OUT localTRIMSTRING with " + vResult_str);
    return(vResult_str);
}

function LOCAL_FILTERSTRING() {
    var args = arguments[0];
    var vInitial = getWidgetValue(args[0]);
    var vMask = args[1];
    //console.log("CPLX IN  localFILTERSTRING with vInitial: " + vInitial + " and vMask: " + vMask);
    var vResult_str = "";
    vResult_str = cleanStringMask(vInitial, vMask);
    //console.log("CPLX OUT localFILTERSTRING with " + vResult_str);
    return(vResult_str);
}

function LOCAL_CLEANSTRINGMASK() {
    var args = arguments[0];
    var vInitial = getWidgetValue(args[0]);
    var vMask = args[1];
    //console.log("CPLX IN  localCLEANSTRINGMASK with vInitial: " + vInitial + " and vMask: " + vMask);
    var vResult_str = "";
    vResult_str = cleanStringMask(vInitial, vMask);
    //console.log("CPLX OUT localCLEANSTRINGMASK with " + vResult_str);
    return(vResult_str);
}

function LOCAL_CLEANSTRING() {
    var args = arguments[0];
    var vInitial = getWidgetValue(args[0]);
    var vSpace = Boolean(typeof args[1] == "undefined" ? true : args[1]);
    var vTAB = Boolean(typeof args[2] == "undefined" ? true : args[2]);
    var vLF = Boolean(typeof args[3] == "undefined" ? true : args[3]);
    var vCR = Boolean(typeof args[4] == "undefined" ? true : args[4]);
    //console.log("CPLX IN  localCLEANSTRING with vInitial: " + vInitial + " and vSpace: " + vSpace + " and vTAB " + vTAB + " and vLF: " + vLF + " and vCR: " + vCR);
    var vResult_str = "";
    vResult_str = cleanString(vInitial, vSpace, vTAB, vLF, vCR);
    //console.log("CPLX OUT localCLEANSTRING with " + vResult_str);
    return(vResult_str);
}

function formatNumber(expression_str) {
    //console.log("CPLX IN  formatNumber with expression_str with " + expression_str);
    var vResult_str;
    var langCountryCode_str = ((lgCO_locale == undefined) || (lgCO_locale == "")) ? "en-US" : lgCO_locale; //fallback

    //  vResult_str = my_formatter.normalize(expression_str, langCountryCode_str);
    vResult_str = normalize(expression_str, langCountryCode_str);

    //console.log("CPLX OUT formatNumber with vResult_str with " + vResult_str);
    return(vResult_str);
}

function getWidgetValue(vWdgName_str) {
    //console.log("CPLX IN  getWidgetValue with " + vWdgName_str);
    var vResult_str = vWdgName_str;
    //console.log("RAY:7:" + vWdgName_str + ": " + wgtsRepo_array);
    vResult_str = wgtsRepo_array[vWdgName_str];
    //console.log("RAY:8: " + vResult_str);
    if(vResult_str == undefined){
        vResult_str = getTokenComplex(vWdgName_str);
    //console.log("RAY:9: " + vResult_str);
    }
    //console.log("CPLX OUT getWidgetValue with " + vResult_str);
    return(vResult_str);
}

function logisticOverlay(vFct_str) {
    //console.log("CPLX IN  logistic with " + vFct_str);
    var vResult_str = "";
    var vFctName_str = "";
    vFctName_str = "LOCAL_" + vFct_str.substr(0, vFct_str.indexOf("("));
    var workString_str = vFct_str.substring(vFct_str.indexOf("(") + 1, vFct_str.lastIndexOf(")"));
    //    //console.log("CPLX  in logistic with workString_str = *" + workString_str + "*");
    var args_array = new Array();
    args_array = workString_str.split(",");
    for(var vCpt_num = 0; vCpt_num < args_array.length; vCpt_num++) {
        args_array[vCpt_num] = getTokenComplex(args_array[vCpt_num]);
    }

    //    var objPart_obj = new Object();
    vResult_str = this[vFctName_str](args_array);
    //  vResult_str = eval(vFctName_str)(args_array);
    tokenArray_array.push(vResult_str);
    //console.log("RAY:1: " + tokenArray_array);
    var vNewExpression_str = "";
    vNewExpression_str = "TOKEN" + String(tokenArray_array.length - 1);
    //console.log("CPLX OUT logistic with " + vNewExpression_str + " = " + vResult_str);
    return(vNewExpression_str);
}

function getTokenComplex(vArg) {
    var vArg_str = String(vArg);
    var vArg_num = 0;
    //console.log("RAY:2:" + vArg_str + ": " + tokenArray_array);
    if(vArg_str.substr(0, 5) == "TOKEN") {
        vArg_num = parseInt(vArg_str.substr(5), 10);
        vArg_str = tokenArray_array[vArg_num];
    }
    //console.log("RAY:3:" + vArg_str + ": " + tokenArray_array);
    return(vArg_str);
}

function tokenizeComplex(workString_str) {
    var vNewExpression_str = "";
    //  //console.log("CPLX IN  tokenize with " + workString_str);
    var vCharIndex_num = 0;
    var vNextQuote_num = 0;
    var vToken_str = "";
    var vTokenFound_bool;
    while(vCharIndex_num < workString_str.length) {
        //    //console.log("CPLX info (vCharIndex_num):" + vCharIndex_num);
        vTokenFound_bool = false;
        if(workString_str.substr(vCharIndex_num, 1) == '"') {
            vNextQuote_num = workString_str.indexOf('"', vCharIndex_num + 1);
            if(vNextQuote_num != -1) {
                vToken_str = workString_str.substring(vCharIndex_num + 1, vNextQuote_num);
                //        //console.log("CPLX     token" + tokenArray_array.length + " is '" + vToken_str + "'");
                tokenArray_array.push(vToken_str);
                //console.log("RAY:4: " + tokenArray_array);
                vTokenFound_bool = true;
                vNewExpression_str += "TOKEN" + String(tokenArray_array.length - 1);
            }
            else {
                //console.log("CPLX  !  double quotes are not matching");
                break;
            }
        }
        if(workString_str.substr(vCharIndex_num, 1) == "'") {
            vNextQuote_num = workString_str.indexOf("'", vCharIndex_num + 1);
            if(vNextQuote_num != -1) {
                vToken_str = workString_str.substring(vCharIndex_num + 1, vNextQuote_num);
                //        //console.log("CPLX     token" + tokenArray_array.length + " is '" + vToken_str + "'");
                tokenArray_array.push(vToken_str);
                //console.log("RAY:5: " + tokenArray_array);
                vTokenFound_bool = true;
                vNewExpression_str += "TOKEN" + String(tokenArray_array.length - 1);
            }
            else {
                //console.log("CPLX  !  simple quotes are not matching");
                break;
            }
        }
        //    //console.log("CPLX info (vTokenFound_bool):" + vTokenFound_bool);
        if(vTokenFound_bool) {
            vCharIndex_num = vNextQuote_num + 1;
        }
        else {
            vNewExpression_str += workString_str.substr(vCharIndex_num, 1);
            vCharIndex_num++;
        }
    }
    workString_str = vNewExpression_str;
    vNewExpression_str = "";
    vCharIndex_num = 0;
    vNextQuote_num = 0;
    vToken_str = "";
    while(vCharIndex_num < workString_str.length) {
        //    //console.log("CPLX info (vCharIndex_num):" + vCharIndex_num);
        vTokenFound_bool = false;
        if((workString_str.charAt(vCharIndex_num) == '[') || (workString_str.charAt(vCharIndex_num) == ']')) {
            vNextQuote_num = vCharIndex_num + 1;
            while((vNextQuote_num < workString_str.length) && (workString_str.charAt(vNextQuote_num) != '[') && (workString_str.charAt(vNextQuote_num) != ']')) {
                vNextQuote_num++;
            }
            if(vNextQuote_num != workString_str.length) {
                vToken_str = workString_str.substring(vCharIndex_num, vNextQuote_num + 1);
                //console.log("CPLX     token" + tokenArray_array.length + " is '" + vToken_str + "'");
                tokenArray_array.push(vToken_str);
                //console.log("RAY:6: " + tokenArray_array);
                vTokenFound_bool = true;
                vNewExpression_str += "TOKEN" + String(tokenArray_array.length - 1);
            }
            else {
                //console.log("CPLX  !  brackets are not matching");
                break;
            }
        }
        //    //console.log("CPLX info (vTokenFound_bool):" + vTokenFound_bool);
        if(vTokenFound_bool) {
            vCharIndex_num = vNextQuote_num + 1;
        }
        else {
            vNewExpression_str += workString_str.substr(vCharIndex_num, 1);
            vCharIndex_num++;
        }
    }
    //  //console.log("CPLX OUT tokenize with " + vNewExpression_str);
    return vNewExpression_str;
}

function parseComplex(vExpression_str) {
    var prevOperator_str; // ='&';
    var vLocalIdxChar_num = 0;
    var vResult_bool; // = true;
    var vCptParentheses_num = 0;
    var vCharIndex_num = 0;
    while(vLocalIdxChar_num < vExpression_str.length) {
        switch(vExpression_str.charAt(vLocalIdxChar_num)) {
            case ('('): {
                vCptParentheses_num = 1;
                vCharIndex_num = vLocalIdxChar_num + 1;
                while((vCptParentheses_num != 0) && (vCharIndex_num < vExpression_str.length)) {
                    if(vExpression_str.charAt(vCharIndex_num) == "(") {
                        vCptParentheses_num++;
                    }
                    if(vExpression_str.charAt(vCharIndex_num) == ")") {
                        vCptParentheses_num--;
                    }
                    vCharIndex_num++;
                }
                var prevResult_bool = vResult_bool;
                vResult_bool = (prevOperator_str == '&') ? vResult_bool && parseComplex(vExpression_str.substring(vLocalIdxChar_num + 1, vCharIndex_num - 1)) : vResult_bool || parseComplex(vExpression_str.substring(vLocalIdxChar_num + 1, vCharIndex_num - 1));
                //        //console.log(vIdxChar_num + ">   " +prevResult_bool+ " " +prevOperator_str+ " eval(" + vExpression_str.substring(vLocalIdxChar_num + 1,vCharIndex_num - 1) + ") returned " + vResult_bool);
                vLocalIdxChar_num = vCharIndex_num;
                break;
            }
            case ('&'):
            case ('|'): {
                prevOperator_str = vExpression_str.charAt(vLocalIdxChar_num);
                //        //console.log(vIdxChar_num + ">   eval operator " + prevOperator_str);
                vLocalIdxChar_num++;
                break;
            }
            case ('t'): {
                vResult_bool = (prevOperator_str == '&') ? vResult_bool : true;
                //        //console.log(vIdxChar_num + ">   eval (true) returned " + vResult_bool);
                vLocalIdxChar_num++;
                break;
            }
            case ('f'): {
                vResult_bool = (prevOperator_str == '|') ? vResult_bool : false;
                //        //console.log(vIdxChar_num + ">   eval (false) returned " + vResult_bool);
                vLocalIdxChar_num++;
                break;
            }
            default : {
                //        //console.log(vIdxChar_num + ">   eval character " + vExpression_str.charAt(vLocalIdxChar_num));
                vLocalIdxChar_num++;
            }
        }
    }
    //  //console.log("CPLX OUT eval (" + vIdxChar_num-- + ") with " + vResult_bool);
    return vResult_bool;
}

function resolvePart(vArgument_str) {
    //console.log("CPLX IN  resolvePart Part with " + vArgument_str);
    var vResult_str = "";
    var vIntermediaryResult_str = "";
    var lastKeyWordPos_num = -1;
    var currentKeyWordPos_num = -1;
    var stillSomethingToProcess_bool = true;
    while(stillSomethingToProcess_bool) {
        for(var vCpt_num = 0; vCpt_num < keyWords_array.length; vCpt_num++) {
            currentKeyWordPos_num = vArgument_str.lastIndexOf(keyWords_array[vCpt_num]);
            if(currentKeyWordPos_num > lastKeyWordPos_num) {
                lastKeyWordPos_num = currentKeyWordPos_num;
            }
        }
        if(lastKeyWordPos_num != -1) {
            stillSomethingToProcess_bool = true;
            var vCharIndex_num = lastKeyWordPos_num;
            var vNextLeftParenthesis_num = vArgument_str.indexOf("(", vCharIndex_num);
            if(vNextLeftParenthesis_num != -1) {
                vCharIndex_num = vNextLeftParenthesis_num + 1;
                var vCptParentheses_num = 1;
                while((vCptParentheses_num != 0) && (vCharIndex_num < vArgument_str.length)) {
                    if(vArgument_str.substr(vCharIndex_num, 1) == "(") {
                        vCptParentheses_num++;
                    }
                    if(vArgument_str.substr(vCharIndex_num, 1) == ")") {
                        vCptParentheses_num--;
                    }
                    vCharIndex_num++;
                }
                var vToResolve_str = vArgument_str.substring(lastKeyWordPos_num, vCharIndex_num);
            }
            vIntermediaryResult_str = logisticOverlay(vToResolve_str);
            vArgument_str = vArgument_str.substring(0, lastKeyWordPos_num) + vIntermediaryResult_str + vArgument_str.substr(vCharIndex_num);
            lastKeyWordPos_num = -1;
        }
        else {
            stillSomethingToProcess_bool = false;
        }
    }
    vResult_str = getWidgetValue(vArgument_str);
    //console.log("CPLX OUT resolvePart Part with " + vResult_str);
    return(vResult_str);
}

function evalBoundedSpace(vFirstArg_num, vLeftBoundMarker_str, vRightBoundMarker_str, vLeftBound_num, vRightBound_num) {
    var vNewExpression_str = "";
    if(isNaN(vFirstArg_num) || isNaN(vLeftBound_num) || isNaN(vRightBound_num)) {
        vNewExpression_str = "false";
    }
    else {
        switch(true) {
            case ((vLeftBoundMarker_str == "[") && (vRightBoundMarker_str == "]")): {
                //console.log("CPLX  !  case 1 with '" + vLeftBoundMarker_str + "' and '" + vRightBoundMarker_str + "'");
                if((vFirstArg_num >= vLeftBound_num) && (vFirstArg_num <= vRightBound_num)) {
                    vNewExpression_str = "true";
                }
                else {
                    vNewExpression_str = "false";
                }
                break;
            }
            case ((vLeftBoundMarker_str == "[") && (vRightBoundMarker_str == "[")): {
                //console.log("CPLX  !  case 2 with '" + vLeftBoundMarker_str + "' and '" + vRightBoundMarker_str + "'");
                if((vFirstArg_num >= vLeftBound_num) && (vFirstArg_num < vRightBound_num)) {
                    vNewExpression_str = "true";
                }
                else {
                    vNewExpression_str = "false";
                }
                break;
            }
            case ((vLeftBoundMarker_str == "]") && (vRightBoundMarker_str == "]")): {
                //console.log("CPLX  !  case 3 with '" + vLeftBoundMarker_str + "' and '" + vRightBoundMarker_str + "'");
                if((vFirstArg_num > vLeftBound_num) && (vFirstArg_num <= vRightBound_num)) {
                    vNewExpression_str = "true";
                }
                else {
                    vNewExpression_str = "false";
                }
                break;
            }
            case ((vLeftBoundMarker_str == "]") && (vRightBoundMarker_str == "[")): {
                //console.log("CPLX  !  case 4 with '" + vLeftBoundMarker_str + "' and '" + vRightBoundMarker_str + "'");
                if((vFirstArg_num > vLeftBound_num) && (vFirstArg_num < vRightBound_num)) {
                    vNewExpression_str = "true";
                }
                else {
                    vNewExpression_str = "false";
                }
                break;
            }
            default : {
                //console.log("CPLX  !  intervals bounds are not handled: '" + vLeftBoundMarker_str + "' and '" + vRightBoundMarker_str + "'");
                }
        }
    }
    return vNewExpression_str;
}

function evalMatchSpace(vFirstCasting_str, vFirstArg_str, vSecondCasting_str, vSecondArg_str, currentChar_str) {
    var vNewExpression_str = "";
    if(((vFirstCasting_str == "string") ? String(vFirstArg_str) : parseFloat(vFirstArg_str)) == ((vSecondCasting_str == "string") ? String(vSecondArg_str) : parseFloat(vSecondArg_str))) {
        //console.log("CPLX ... resolve Complex MATCH arguments are the same: (" + vFirstCasting_str + ") " + vFirstArg_str + " == (" + vSecondCasting_str + ") " + vSecondArg_str);
        vNewExpression_str = "true";
    }
    else {
        //console.log("CPLX ... resolve Complex MATCH arguments are different: (" + vFirstCasting_str + ") " + vFirstArg_str + " != (" + vSecondCasting_str + ") " + vSecondArg_str);
        vNewExpression_str = "false";
    }
    if(currentChar_str == '$') {
        vNewExpression_str = (vNewExpression_str == "false") ? "true" : "false";
    }
    return vNewExpression_str;
}

function resolveComplex(vEndorsment_str, widgetsRepository_array) {
    //console.log("CPLX IN  resolveComplex with " + vEndorsment_str);
    // the trick is "only MATCH or INTERVAL are evaluated"; for the rest, we normalize the expression and simply eval() it as we expect a simple boolean
    var vNewExpression_str = "";
    var vNextIdx_num = 0;
    var vNextPointer_num = 0;
    var vFirstArg_num;
    var vCurrentTarget_str;
    var workString_str = vEndorsment_str;
    var vNextMatch_num = workString_str.indexOf("MATCH", vNextIdx_num);
    var vNextInterval_num = workString_str.indexOf("INTERVAL", vNextIdx_num);
    while((vNextMatch_num != -1) || (vNextInterval_num != -1)) {
        if(vNextMatch_num != -1) {
            if(vNextInterval_num != -1) {
                if(vNextMatch_num < vNextInterval_num) {
                    vNextPointer_num = vNextMatch_num;
                    vCurrentTarget_str = "MATCH";
                }
                else {
                    vNextPointer_num = vNextInterval_num;
                    vCurrentTarget_str = "INTERVAL";
                }
            }
            else {
                vNextPointer_num = vNextMatch_num;
                vCurrentTarget_str = "MATCH";
            }
        }
        else {
            vNextPointer_num = vNextInterval_num;
            vCurrentTarget_str = "INTERVAL";
        }
        vNewExpression_str += workString_str.substring(vNextIdx_num, vNextPointer_num);
        //console.log("CPLX .   resolve Complex with " + vNewExpression_str);
        //console.log("CPLX >   resolve Complex with " + vCurrentTarget_str);
        targetPointers_array.push(vCurrentTarget_str);
        var vCharIndex_num = vNextPointer_num + 5;
        var vNextLeftParenthesis_num = workString_str.indexOf("(", vCharIndex_num);
        if(vNextLeftParenthesis_num != -1) {
            vCharIndex_num = vNextLeftParenthesis_num + 1;
            var vCptParentheses_num = 1;
            while((vCptParentheses_num != 0) && (vCharIndex_num < workString_str.length)) {
                if(workString_str.substr(vCharIndex_num, 1) == "(") {
                    vCptParentheses_num++;
                }
                if(workString_str.substr(vCharIndex_num, 1) == ")") {
                    vCptParentheses_num--;
                }
                vCharIndex_num++;
            }
            var vToResolve_str = workString_str.substring(vNextLeftParenthesis_num + 1, vCharIndex_num - 1);
            vNewExpression_str = vNewExpression_str + resolveComplex(vToResolve_str, widgetsRepository_array);
        //console.log("CPLX ..  resolve Complex with " + vNewExpression_str);
        }
        else {
            //console.log("CPLX  !  parentheses are not matching");
            break;
        }
        vNextIdx_num = vCharIndex_num;
        vNextMatch_num = workString_str.indexOf("MATCH", vNextIdx_num);
        vNextInterval_num = workString_str.indexOf("INTERVAL", vNextIdx_num);
    }
    //console.log("CPLX >.  resolve Complex with '" + vNewExpression_str + "'");
    if(vNewExpression_str == "") {
        var vCharPos_num;
        vCharPos_num = 0;
        var vCptParenthesesOpened_num = 0;
        var vCptQuotesOpened_bool = false;
        var currentChar_str = workString_str.charAt(vCharPos_num);
        //var debugCpt_num = 0;
        while(!(((currentChar_str == ',') || (currentChar_str == '$')) && (vCptParenthesesOpened_num == 0) && (!vCptQuotesOpened_bool) && (vCharPos_num < workString_str.length))) {
            /*
        //console.log("CPLX .. EVAL (currentChar_str[" + currentChar_str + "] == ','): " + (currentChar_str == ','));
        //console.log("CPLX .. EVAL (vCptParenthesesOpened_num == 0): " + (vCptParenthesesOpened_num == 0));
        //console.log("CPLX .. EVAL (!vCptQuotesOpened_bool): " + (!vCptQuotesOpened_bool));
        //console.log("CPLX .. EVAL (vCharPos_num[" + vCharPos_num + "] < workString_str.length[" + workString_str.length + "]): " + (vCharPos_num < workString_str.length));
        //console.log("CPLX ..  resolve Complex EVAL (!((" + (currentChar_str == ',') + ") && (" + (vCptParenthesesOpened_num == 0) + ") && (!" + vCptQuotesOpened_bool + ") && (" + (vCharPos_num < workString_str.length) + "))");
*/
            if(currentChar_str == '"') {
                vCptQuotesOpened_bool = !vCptQuotesOpened_bool;
            }
            if(currentChar_str == '(') {
                vCptParenthesesOpened_num++;
            }
            if(currentChar_str == ')') {
                vCptParenthesesOpened_num--;
            }
            vCharPos_num++;
            currentChar_str = workString_str.charAt(vCharPos_num);
        /* // for debugging infinite loops
debugCpt_num++ ;
if(debugCpt_num > 100){
  //console.log("CPLX  !!!  BREAK for debug");
  break;
}
*/
        }
        if(((currentChar_str == ',') || (currentChar_str == '$')) && (vCptParenthesesOpened_num == 0) && (!vCptQuotesOpened_bool) && (vCharPos_num < workString_str.length)) {
            var vFirstArg_str = workString_str.substring(0, vCharPos_num);
            var vSecondArg_str = workString_str.substring(vCharPos_num + 1);
            var vFirstCasting_str;
            var vSecondCasting_str;
            switch(true) {
                case (vFirstArg_str.charAt(0) == '"'): {
                    vFirstCasting_str = "string";
                    break;
                }
                case (isNaN(vFirstArg_str) == false): {
                    vFirstCasting_str = "number";
                    break;
                }
                case (vFirstArg_str.substr(0, 5) == "PARSE"): {
                    vFirstCasting_str = "number";
                    break;
                }
                default : {
                    vFirstCasting_str = "string";
                }
            }
            switch(true) {
                case (vSecondArg_str.charAt(0) == '"'): {
                    vSecondCasting_str = "string";
                    break;
                }
                case (isNaN(vSecondArg_str) == false): {
                    vSecondCasting_str = "number";
                    break;
                }
                case (vSecondArg_str.substr(0, 5) == "PARSE"): {
                    vSecondCasting_str = "number";
                    break;
                }
                default : {
                    vSecondCasting_str = "string";
                }
            }
            //    vNewExpression_str = vNewExpression_str + resolveComplex(vToResolve_str,widgetsRepository_array);
            //console.log("CPLX --  resolve Complex BEFORE vFirstArg_str with " + vFirstArg_str);
            vFirstArg_str = getTokenComplex(resolvePart(vFirstArg_str));
            //console.log("CPLX --  resolve Complex AFTER vFirstArg_str with " + vFirstArg_str);
            //console.log("CPLX --  resolve Complex BEFORE vSecondArg_str with " + vSecondArg_str);
            vSecondArg_str = getTokenComplex(resolvePart(vSecondArg_str));
        //console.log("CPLX --  resolve Complex AFTER vSecondArg_str with " + vSecondArg_str);
        }
        vCurrentTarget_str = String(targetPointers_array.pop());
        //console.log("CPLX >>  resolve Complex with " + vCurrentTarget_str);
        if((vCurrentTarget_str == "MATCH") || (scoreType_str == "MATCH")) {
            var vSemiColonPos_num = vFirstArg_str.indexOf(';');
            if(vSemiColonPos_num != -1) {
                var elements_array = new Array();
                elements_array = vFirstArg_str.split(";");
                var vNewExpression_t_str = "";
                var vFirstArg_t_str = "";
                for(var vCpt_num = 0; vCpt_num < elements_array.length; vCpt_num++) {
                    vFirstArg_num = parseFloat(elements_array[vCpt_num]);
                    if(isNaN(vFirstArg_num)) {
                        vNewExpression_t_str = "false";
                    }
                    else {
                        vFirstArg_t_str = String(vFirstArg_num);
                        vNewExpression_t_str = evalMatchSpace("number", vFirstArg_t_str, vSecondCasting_str, vSecondArg_str, currentChar_str);
                    }
                    //console.log("CPLX  !  vFirstArg_num = " + vFirstArg_num + " -> vNewExpression_t_str is '" + vNewExpression_t_str + "'");
                    vNewExpression_str = ((vNewExpression_str == "true") || (vNewExpression_t_str == "true")) ? "true" : "false";
                }
            }
            else {
                vNewExpression_str = evalMatchSpace(vFirstCasting_str, vFirstArg_str, vSecondCasting_str, vSecondArg_str, currentChar_str);
            }
        }
        if(vCurrentTarget_str == "INTERVAL") {
            var interval_str = trimString(vSecondArg_str, true, true);
            var vLeftBoundMarker_str = interval_str.charAt(0);
            var vRightBoundMarker_str = interval_str.substr(-1, 1);
            var vLeftBound_str = interval_str.substr(1, interval_str.indexOf(","));
            var vRightBound_str = interval_str.substr(interval_str.indexOf(",") + 1);
            //console.log("CPLX ... resolve Complex INTERVAL arguments are: (" + vFirstCasting_str + ") " + vFirstArg_str + " vs (" + vSecondCasting_str + ") " + vSecondArg_str);
            if(vFirstCasting_str == "string") {
            // text interval - not handled yet
            //console.log("CPLX  !  text intervals are not handled");
            }
            else {
                var vLeftBound_num = parseFloat(vLeftBound_str);
                var vRightBound_num = parseFloat(vRightBound_str);
                var vSemiColonPos_num = vFirstArg_str.indexOf(';');
                if(vSemiColonPos_num != -1) {
                    var elements_array = new Array();
                    elements_array = vFirstArg_str.split(";");
                    var vNewExpression_t_str = "";
                    var vFirstArg_t_str = "";
                    for(var vCpt_num = 0; vCpt_num < elements_array.length; vCpt_num++) {
                        vFirstArg_num = parseFloat(elements_array[vCpt_num]);
                        if(isNaN(vFirstArg_num)) {
                            vNewExpression_t_str = "false";
                        }
                        else {
                            vNewExpression_t_str = evalBoundedSpace(vFirstArg_num, vLeftBoundMarker_str, vRightBoundMarker_str, vLeftBound_num, vRightBound_num);
                        }
                        //console.log("CPLX  !  vFirstArg_num = " + vFirstArg_num + " -> vNewExpression_t_str is '" + vNewExpression_t_str + "'");
                        vNewExpression_str = ((vNewExpression_str == "true") || (vNewExpression_t_str == "true")) ? "true" : "false";
                    }
                }
                else {
                    vFirstArg_num = parseFloat(vFirstArg_str);
                    vNewExpression_str = evalBoundedSpace(vFirstArg_num, vLeftBoundMarker_str, vRightBoundMarker_str, vLeftBound_num, vRightBound_num);
                }
            //console.log("CPLX  !  vNewExpression_str is '" + vNewExpression_str + "'");
            }
        }
    }
    else {
        //console.log("CPLX ... resolve Complex vNewExpression_str: " + vNewExpression_str + " and vNextMatch_num: " + vNextMatch_num);
        vNewExpression_str += workString_str.substr(vNextIdx_num);
    }
    //console.log("CPLX OUT resolveComplex with " + vNewExpression_str);
    return vNewExpression_str;
}
/*
function test(){
  my_test_array = new Array();
//  my_test_array["inquiry_1_interaction_0"] = "22";
//  my_test_array["inquiry_1_interaction_1"] = "15,5";
//  tao_COMPLEX(my_test_array,"COMPLEX");
  tao_COMPLEX({inquiry_1_interaction_0:"22", inquiry_1_interaction_1:"15,5"},"COMPLEX");
  scoreThis("{{{INTERVAL(PARSEFRACT(inquiry_1_interaction_0),[15.1,15.8])} && {INTERVAL(PARSEFRACT(inquiry_1_interaction_1),[20.6,21.3])}} || {{INTERVAL(PARSEFRACT(inquiry_1_interaction_0),[20.6,21.3])} && {INTERVAL(PARSEFRACT(inquiry_1_interaction_1),[15.1,15.8])}}}");
}*/

//var lgCO_locale = "fr-CA";
var lgCO_locale = null;
//test();



//// PIAAC platform interaction

var userVarName = '';
var pagename = null;

function useForms()
{
    lgCO_locale = getLang();
    //restore context
    pagename = getCurrentPageName();
    userVarName = getCurrentUnitID() + 'SaveStateQuestion' + getCurrentItemID();
    var formContext = getUserVar(userVarName);
	if ((formContext != null) && (pagename in formContext))
	{
		formContext = formContext[pagename];
		for (var i in formContext)
		{
			var el = $('#'+i);
			if ($(el).is(':checkbox')) {
				$(el).prop('checked', (formContext[i] == "1") );
            } else if ($(el).is(':radio') && formContext[i] == "1") {
				$(el).prop('checked', (formContext[i] == "1") );
			} else {
				$(el).val( formContext[i] );
			}
		}
	}
    AddCallbackEvent('onItemEnd', scoreForm);
    AddCallbackEvent('scoreNowEvent', scoreForm);//for scoretest module
    AddCallbackEvent('onItemEnd', unbindScoreNowEvent);
    $(window).bind('unload',saveFormInContext);
}


function saveFormInContext()
{
	//saving context
	var formObject = getUserVar(userVarName);
	if ( formObject == null)
	{
		formObject = {};
	}
	$('input, select, textarea').each(function(index, el)
	{
		//test val() on each form type, and in multiple mode
		var ans = '';
		if ($(el).is(':checkbox') || $(el).is(':radio'))
		{
			if ($(el).is(':checked'))
			{
				ans = "1";
			}
			else
			{
				ans = "";
			}
		}
		else
		{
			ans = $(el).val();
		}

        if (typeof(formObject[pagename]) == 'undefined')
        {
            formObject[pagename] = {};
        }
        formObject[pagename][$(el).attr('id')] = ans;
    });
    //saving in context
    setUserVar(userVarName, formObject);
}

var NRscore = 9;   //NR = no response (blank)
var NCscore = 0;   //NC = no credit (wrong)

function scoreRule(ruleStr) {
	var rules = ruleStr.split("%%");
	var subrules = [];

	NRscore = 9;   //Set default NR = no response (blank)
	NCscore = 0;   //Set default NC = no credit (wrong)
	if (rules.length == 1) {
		subrules.push({score: 1, rule: rules[0]});
	} else {
		for (var i = 0; i < rules.length; i++) {
			var subrule = rules[i].trim().split(":", 2);
            var rule = subrule[1].trim();
            var score = subrule[0].trim();
            if (rule == "NC")
                NCscore = score;
            else if (rule == "NR")
                NRscore = score;
            else
    			subrules.push({'score': score, 'rule': rule});
		}
	}

  	var score;
  	var idx = 0;

  	do {
   	    score = scoreThis(subrules[idx].rule);	
        idx++;
  	} while (!score && idx < subrules.length);
	
    var scoreVal = NCscore;
  	if (score)
  		scoreVal = subrules[idx-1].score;
    
    return scoreVal;
}


function scoreForm(params, moduleID, noEvents)
{
    saveFormInContext();
	
	var formsObject = getUserVar(userVarName);
	var noAnswer = true;
	var answer = '';
	var formObject = getUserVar('defaultValues');
	if (formObject == null)
	{
		formObject = {};
	}
	if (formsObject != null)
	{
		for (var page in formsObject)
		{
			for (var i in formsObject[page])
			{
				formObject[i] = toWesternDigits(formsObject[page][i]);
				if (answer.length > 0)
				{
					answer += '; ';
				}
				answer += i + ":" + formObject[i];
				if (formObject[i] != '')
				{
					noAnswer = false;
				}
			}
		}
	}

	tao_COMPLEX(formObject, "COMPLEX");

    var time = getGlobalTime();
    var actionCounter = GetActionsCount();
    var timefirstAction = getTimeFirstAction();
	var ruleStr = getRule();
    var pLoad = {
        rule: ruleStr,
        result: 1,
        response: answer,
        itemDuration: time.item,
        TimeTotal: time.unit,
        TimeFAction: timefirstAction,
        NbrAction: actionCounter
    };

    //scoring
    var subitems = ruleStr.split("@@");

    if (subitems.length == 1) {
        var scoreVal = scoreRule(ruleStr);
        if (noAnswer) {
            //no answer
            pLoad.result = NRscore;
        } else {
            pLoad.result = scoreVal;
        }
    } else {
        var subScores = {};
        var allCorrect = true;
        for (var i=0; i < subitems.length; i++) {
            var ary = subitems[i].trim().split("::");
            var id = ary[0].trim();
            var subrule = ary[1].trim();
            subScores[id] = scoreRule(subrule);
            pLoad[id] = subScores[id];
            if (subScores[id] != 1) 
                allCorrect = false;
        }
        
        pLoad.result = (noAnswer ? NRscore : (allCorrect ? 1 : NCscore));
    }
    
    if (!noEvents) {
        feedtrace('form', 'scoring', pLoad);
        TriggerEvent('scoreNowResult', 'scoring', pLoad);
        RemoveCallback('onItemEnd', scoreForm);
    } else {
        return pLoad;
    }
}

function unbindScoreNowEvent()
{
	RemoveCallback('scoreNowEvent', scoreForm);
}


function getCurrentPageName()
{
    var path = document.location.pathname;
    return path.substring(path.lastIndexOf('/') + 1).replace(/\./g, '_');
}
