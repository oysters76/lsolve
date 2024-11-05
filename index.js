var ErrorType;
(function (ErrorType) {
    ErrorType[ErrorType["ROW_INDEX_OUT_OF_BOUNDS"] = 1] = "ROW_INDEX_OUT_OF_BOUNDS";
    ErrorType[ErrorType["SUCCESS"] = 2] = "SUCCESS";
    ErrorType[ErrorType["VALUES_ARRAY_HAS_UNMATCH_LENGTH"] = 3] = "VALUES_ARRAY_HAS_UNMATCH_LENGTH";
})(ErrorType || (ErrorType = {}));
var Matrix = /** @class */ (function () {
    function Matrix(n, m, defaultVal) {
        this.n = n;
        this.m = m;
        this.matrix = this.makeMatrix(defaultVal);
    }
    Matrix.prototype.makeMatrix = function (defaultVal) {
        var matrix = [];
        for (var i = 0; i < this.n; i++) {
            var row = [];
            for (var j = 0; j < this.m; j++) {
                row.push(defaultVal);
            }
            matrix.push(row);
        }
        return matrix;
    };
    Matrix.prototype.addEquation = function (row_index, values) {
        if (row_index < 0 || row_index >= this.n)
            return ErrorType.ROW_INDEX_OUT_OF_BOUNDS;
        if (values.length != this.m)
            return ErrorType.VALUES_ARRAY_HAS_UNMATCH_LENGTH;
        this.matrix[row_index] = values;
        return ErrorType.SUCCESS;
    };
    Matrix.prototype.scaleRow = function (row_index, scaler) {
        if (row_index < 0 || row_index >= this.n)
            return ErrorType.ROW_INDEX_OUT_OF_BOUNDS;
        for (var i = 0; i < this.m; i++) {
            this.matrix[row_index][i] *= scaler;
        }
        return ErrorType.SUCCESS;
    };
    Matrix.prototype.scaleSomeRow = function (row, scaler) {
        for (var i = 0; i < row.length; i++) {
            row[i] *= scaler;
        }
        return row;
    };
    Matrix.prototype.copyRow = function (row_index) {
        var r = [];
        for (var i = 0; i < this.matrix[row_index].length; i++) {
            r.push(this.matrix[row_index][i]);
        }
        return r;
    };
    Matrix.prototype.addRows = function (row1, row2) {
        var r = [];
        for (var i = 0; i < row1.length; i++) {
            r.push(row1[i] + row2[i]);
        }
        return r;
    };
    Matrix.prototype.replaceRow = function (row_index, row) {
        for (var i = 0; i < this.matrix[row_index].length; i++) {
            this.matrix[row_index][i] = row[i];
        }
    };
    Matrix.prototype.rowOperation = function (index_of_row1, index_of_row2, scaler, where_to_add) {
        if (index_of_row1 < 0 || index_of_row1 >= this.n)
            return ErrorType.ROW_INDEX_OUT_OF_BOUNDS;
        if (index_of_row2 < 0 || index_of_row2 >= this.n)
            return ErrorType.ROW_INDEX_OUT_OF_BOUNDS;
        var scaledRow1 = this.scaleSomeRow(this.copyRow(index_of_row1), scaler);
        var row2 = this.copyRow(index_of_row2);
        this.replaceRow(where_to_add, this.addRows(scaledRow1, row2));
        return ErrorType.SUCCESS;
    };
    Matrix.prototype.swapRows = function (index_of_row1, index_of_row2) {
        if (index_of_row1 < 0 || index_of_row1 >= this.n)
            return ErrorType.ROW_INDEX_OUT_OF_BOUNDS;
        if (index_of_row2 < 0 || index_of_row2 >= this.n)
            return ErrorType.ROW_INDEX_OUT_OF_BOUNDS;
        var temp = this.copyRow(index_of_row1);
        for (var i = 0; i < this.m; i++) {
            this.matrix[index_of_row1][i] = this.matrix[index_of_row2][i];
        }
        for (var i = 0; i < this.m; i++) {
            this.matrix[index_of_row2][i] = temp[i];
        }
    };
    Matrix.prototype.print = function () {
        var printBuffer = "\n";
        for (var i = 0; i < this.n; i++) {
            printBuffer += "[";
            for (var j = 0; j < this.m; j++) {
                printBuffer += this.matrix[i][j] + " ";
            }
            printBuffer += "]\n";
        }
        console.log(printBuffer);
    };
    Matrix.prototype.getRows = function () {
        return this.n;
    };
    Matrix.prototype.getColumns = function () {
        return this.m;
    };
    Matrix.prototype.getValue = function (i, j) {
        return this.matrix[i][j];
    };
    return Matrix;
}());
function deferError(err) {
    if (err != null) {
        alert(err);
    }
    document.getElementById("txtCommand").value = "";
}
function clearField() {
    document.getElementById("txtCommand").value = "";
}
function printMatrix(matrix) {
    // $$\begin{pmatrix}a & b\\\ c & d\end{pmatrix}$$
    var currentBuffer = document.getElementById("equation_area").innerHTML;
    if (currentBuffer == null)
        currentBuffer = "";
    if (currentMatrix == null)
        return;
    var n = currentMatrix.getRows();
    var m = currentMatrix.getColumns();
    currentBuffer += '\$\$ M = \\begin{pmatrix}';
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < m; j++) {
            currentBuffer += matrix.getValue(i, j);
            currentBuffer += j == (m - 1) ? '' : ' & ';
        }
        if (i != (n - 1))
            currentBuffer += '\\\\';
    }
    currentBuffer += '\\end{pmatrix}\$\$';
    console.log(currentBuffer);
    document.getElementById("equation_area").innerHTML = currentBuffer;
    MathJax.typeset();
    return;
}
var currentMatrix = null;
var previousMatrix = null;
function onCommand(command) {
    if (command == "") {
        deferError(null);
        return;
    }
    if (command == "clear") {
        document.getElementById("equation_area").innerHTML = "";
        currentMatrix = null;
        clearField();
    }
    var arr = command.split(" ");
    var prefix = arr[0];
    if (prefix == "new") {
        if (arr.length < 3) {
            deferError("Few arguments for new command");
            return;
        }
        var n = parseInt(arr[1]);
        var m = parseInt(arr[2]);
        var d = 0;
        if (arr.length == 4) {
            d = parseInt(arr[3]);
        }
        currentMatrix = new Matrix(n, m, d);
        printMatrix(currentMatrix);
        clearField();
        return;
    }
    if (prefix == "op") {
        if (arr.length < 5) {
            deferError("Too few arguments");
            return;
        }
        if (currentMatrix == null) {
            deferError("Matrix isnt defined!");
            return;
        }
        try {
            var r1 = parseInt(arr[1]);
            var r2 = parseInt(arr[2]);
            var scaler = parseFloat(arr[3]);
            var where = parseInt(arr[4]);
            var errType = currentMatrix.rowOperation(r1, r2, scaler, where);
            if (errType != ErrorType.SUCCESS) {
                deferError("Error occurred in row operation");
                return;
            }
            printMatrix(currentMatrix);
            clearField();
            return;
        }
        catch (error) {
            deferError("error occurred");
            return;
        }
    }
    if (prefix == "swap") {
        if (arr.length < 3) {
            deferError("Too few arguments");
            return;
        }
        if (currentMatrix == null) {
            deferError("Matrix isnt defined!");
            return;
        }
        try {
            var r1 = parseInt(arr[1]);
            var r2 = parseInt(arr[2]);
            currentMatrix.swapRows(r1, r2);
            printMatrix(currentMatrix);
            clearField();
            return;
        }
        catch (error) {
            deferError("Error occurred");
            return;
        }
    }
    if (prefix == "scale") {
        if (arr.length < 3) {
            deferError("Too few arguments");
            return;
        }
        if (currentMatrix == null) {
            deferError("Matrix isnt defined!");
            return;
        }
        try {
            var r1 = parseInt(arr[1]);
            var scaler = parseFloat(arr[2]);
            currentMatrix.scaleRow(r1, scaler);
            printMatrix(currentMatrix);
            clearField();
            return;
        }
        catch (error) {
            deferError("Error occurred");
            return;
        }
    }
    if (prefix == "eq") {
        if (currentMatrix == null) {
            deferError("Matrix isnt defined!");
            return;
        }
        if (arr.length < currentMatrix.getColumns() + 2) {
            deferError("Too new arguments");
            return;
        }
        try {
            var r1 = parseInt(arr[1]);
            var values = [];
            for (var i = 0; i < currentMatrix.getColumns(); i++) {
                values.push(parseFloat(arr[i + 2]));
            }
            currentMatrix.addEquation(r1, values);
            printMatrix(currentMatrix);
            clearField();
            return;
        }
        catch (error) {
            deferError("Error occurred");
            return;
        }
    }
}
window.onload = function (event) {
    document.getElementById("btnCommand").addEventListener("click", function (event) {
        var command = document.getElementById("txtCommand").value;
        onCommand(command);
    });
};
