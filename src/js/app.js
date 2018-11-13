import $ from 'jquery';
import { parseCode } from './code-analyzer';
import parser from './parser';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);

        parser.clearTable();
        print(parser.printTable());

        parser.objectToTable(parsedCode);

        print(parser.printTable());

        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
    });

    function print(_html) {
        document.getElementById('sol').style.display = 'table';
        document.getElementById('outputTable').innerHTML = _html;
    }
});