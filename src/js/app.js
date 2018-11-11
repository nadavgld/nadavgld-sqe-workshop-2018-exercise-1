import $ from 'jquery';
import { parseCode } from './code-analyzer';
import parser from './parser';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);

        parser.clearTable()
        parser.objectToTable(parsedCode)
        parser.printTable()
        
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
    });
});
