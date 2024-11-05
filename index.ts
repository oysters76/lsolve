

 enum ErrorType{
    ROW_INDEX_OUT_OF_BOUNDS = 1, 
    SUCCESS,
    VALUES_ARRAY_HAS_UNMATCH_LENGTH,
}

class Matrix{

    private n:number; 
    private m:number; 
    private matrix: number[][]; 

   

    constructor(n:number, m:number, defaultVal:number){
        this.n = n; 
        this.m = m; 
        this.matrix = this.makeMatrix(defaultVal); 
    }

    private makeMatrix(defaultVal:number) : number[][]{
        let matrix = []; 
        for (let i = 0; i < this.n; i++){
            let row = []; 
            for (let j = 0; j < this.m; j++){
                row.push(defaultVal); 
            }
            matrix.push(row); 
        }
        return matrix; 
    }

    public addEquation(row_index:number, values:number[]) : ErrorType{
        if (row_index < 0 || row_index >= this.n) return ErrorType.ROW_INDEX_OUT_OF_BOUNDS; 
        if (values.length != this.m) return ErrorType.VALUES_ARRAY_HAS_UNMATCH_LENGTH;
        this.matrix[row_index] = values;
        return ErrorType.SUCCESS; 
    } 

    public scaleRow(row_index:number, scaler:number) : ErrorType{
        if (row_index < 0 || row_index >= this.n) return ErrorType.ROW_INDEX_OUT_OF_BOUNDS;
        for (let i = 0; i < this.m; i++){
            this.matrix[row_index][i] *= scaler;
        }
        return ErrorType.SUCCESS; 
    }

    private scaleSomeRow(row:number[], scaler:number) : number[]{
        for (let i = 0; i < row.length; i++){
            row[i] *= scaler; 
        }
        return row; 
    }

    private copyRow(row_index:number) : number[] {
        let r = []; 
        for (let i = 0; i < this.matrix[row_index].length; i++){
            r.push(this.matrix[row_index][i]); 
        }
        return r;
    }

    private addRows(row1:number[], row2:number[]) : number[]{
        let r = []; 
        for (let i = 0; i < row1.length; i++){
            r.push(row1[i] + row2[i]);
        }
        return r; 
    }

    private replaceRow(row_index:number, row:number[]){ 
        for (let i = 0; i < this.matrix[row_index].length; i++){
            this.matrix[row_index][i] = row[i];  
        }
    }

    public rowOperation(index_of_row1:number, index_of_row2:number, scaler:number, where_to_add:number) : ErrorType{
        if (index_of_row1 < 0 || index_of_row1 >= this.n) return ErrorType.ROW_INDEX_OUT_OF_BOUNDS; 
        if (index_of_row2 < 0 || index_of_row2 >= this.n) return ErrorType.ROW_INDEX_OUT_OF_BOUNDS; 
        let scaledRow1 = this.scaleSomeRow(this.copyRow(index_of_row1), scaler); 
        let row2 = this.copyRow(index_of_row2); 
        this.replaceRow(where_to_add, this.addRows(scaledRow1, row2)); 
        return ErrorType.SUCCESS; 
    }

    public swapRows(index_of_row1:number, index_of_row2:number) : ErrorType{
        if (index_of_row1 < 0 || index_of_row1 >= this.n) return ErrorType.ROW_INDEX_OUT_OF_BOUNDS; 
        if (index_of_row2 < 0 || index_of_row2 >= this.n) return ErrorType.ROW_INDEX_OUT_OF_BOUNDS; 
      	let temp = this.copyRow(index_of_row1);
	for (let i = 0; i < this.m; i++){
	    this.matrix[index_of_row1][i] = this.matrix[index_of_row2][i]; 
	}
	for (let i = 0; i < this.m; i++){
	    this.matrix[index_of_row2][i] = temp[i]; 
	}
    }

    public print(){
        let printBuffer:string = "\n"; 
        for (let i = 0; i < this.n; i++){
            printBuffer += "["; 
            for (let j = 0; j < this.m; j++){
                printBuffer += this.matrix[i][j] + " "; 
            }
            printBuffer += "]\n"; 
        }
        console.log(printBuffer); 
    }

    public getRows(){
     return this.n; 
    }

    public getColumns(){
     return this.m; 
    }

    public getValue(i:number, j:number):number{
      return this.matrix[i][j]; 
    }
 }

function deferError(err:null|string){
 if (err != null){
  alert(err); 
 }
 (<HTMLInputElement>document.getElementById("txtCommand")).value = ""; 
}

function clearField(){
  (<HTMLInputElement>document.getElementById("txtCommand")).value = ""; 
}

function printMatrix(matrix:Matrix|null){
 // $$\begin{pmatrix}a & b\\\ c & d\end{pmatrix}$$
 let currentBuffer:null|string = document.getElementById("equation_area").innerHTML;
 if (currentBuffer == null) currentBuffer = "";
 if (currentMatrix == null) return;
 let n = currentMatrix.getRows();
 let m = currentMatrix.getColumns();
 
 currentBuffer += '\$\$ M = \\begin{pmatrix}';  
 for (let i = 0; i < n; i++){
   for (let j = 0; j < m; j++){
     currentBuffer +=  matrix.getValue(i,j);
     currentBuffer +=  j == (m-1) ? '' : ' & '; 
   }
   if (i != (n-1))
      currentBuffer += '\\\\'; 
 }
 currentBuffer += '\\end{pmatrix}\$\$';
 console.log(currentBuffer);
 document.getElementById("equation_area").innerHTML = currentBuffer; 
 MathJax.typeset();
 return; 
}

let currentMatrix : null|Matrix = null; 
let previousMatrix : null|Matrix = null;

function onCommand(command:string){
 if (command == "") {
   deferError(null);
   return; 
 }
 if (command == "clear"){
   document.getElementById("equation_area").innerHTML = "";
   currentMatrix = null; 
   clearField(); 
 }
 let arr :string[] = command.split(" "); 
 let prefix = arr[0];
 if (prefix == "new"){
  if (arr.length < 3){ deferError("Few arguments for new command"); return; }
  let n:number = parseInt(arr[1]);
  let m:number = parseInt(arr[2]);
  let d:number = 0; 
  if (arr.length == 4){
   d = parseInt(arr[3]); 
  }
  currentMatrix = new Matrix(n,m,d);
  printMatrix(currentMatrix);  
  clearField(); 
  return; 
 }
 if (prefix == "op"){
   if (arr.length < 5){
     deferError("Too few arguments");
     return; 
   }
   if (currentMatrix == null){
     deferError("Matrix isnt defined!");
     return; 
   }
    try{
       let r1 = parseInt(arr[1]);
       let r2 = parseInt(arr[2]);
       let scaler = parseFloat(arr[3]);
       let where = parseInt(arr[4]);

       
       let errType : ErrorType = currentMatrix.rowOperation(r1, r2, scaler, where);
       if (errType != ErrorType.SUCCESS){
       	  deferError("Error occurred in row operation");
	  return; 
       }
       printMatrix(currentMatrix);  
       clearField(); 
       return;
    }catch(error){
       deferError("error occurred");
       return; 
    }
   }

   if (prefix == "swap"){
      if (arr.length < 3){
      	 deferError("Too few arguments");
     	 return; 
     }
     if (currentMatrix == null){
     	deferError("Matrix isnt defined!");
     	return; 
     }
     
     try{
	let r1 = parseInt(arr[1]);
     	let r2 = parseInt(arr[2]);
     	currentMatrix.swapRows(r1, r2);
  	printMatrix(currentMatrix);  
        clearField(); 
        return;
     }catch(error){
       deferError("Error occurred");
       return; 
     }
   }

   if (prefix == "scale"){
     if (arr.length < 3){
      	 deferError("Too few arguments");
     	 return; 
     }
     if (currentMatrix == null){
     	deferError("Matrix isnt defined!");
     	return; 
     }
     
     try{
	let r1 = parseInt(arr[1]);
     	let scaler = parseFloat(arr[2]);
     	currentMatrix.scaleRow(r1, scaler);
  	printMatrix(currentMatrix);  
        clearField(); 
        return;
     }catch(error){
       deferError("Error occurred");
       return; 
     }
   }
   if (prefix == "eq"){
    
     if (currentMatrix == null){
     	deferError("Matrix isnt defined!");
     	return; 
     }
     if (arr.length < currentMatrix.getColumns()+2){
        deferError("Too new arguments");
	return; 
     } 
     try{
	let r1 = parseInt(arr[1]); 
	let values :number[] = [];
	for (let i = 0; i < currentMatrix.getColumns(); i++){
	    values.push(parseFloat(arr[i+2])); 
	}
	currentMatrix.addEquation(r1, values);
  	printMatrix(currentMatrix);  
        clearField(); 
        return;
     }catch(error){
       deferError("Error occurred");
       return; 
     }
   }
}

window.onload = function(event){

  document.getElementById("btnCommand").addEventListener("click", function(event){
   const command:string = (<HTMLInputElement>document.getElementById("txtCommand")).value;
   onCommand(command); 
 }); 

}

