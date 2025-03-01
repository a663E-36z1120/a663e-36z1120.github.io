
document.addEventListener("DOMContentLoaded", () => {

  var isMobile = false; //initiate as false
  var wasMobile = false;
  // device detection
  if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
      || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
    isMobile = true;
    wasMobile = true;
  }
  isMobile = window.innerWidth < 1.5*window.innerHeight;

  function checkAndToggleMobile() {
    const newIsMobile = window.innerWidth < 1.5*window.innerHeight;

    if (wasMobile === false && isMobile !== newIsMobile) {
        isMobile = newIsMobile;
        location.reload(); // Refresh the page after toggling isMobile
    }
  }
  
  // Conway's game of life...
  // GAME RULES:
  // 1. Birth Rule: If has 3 neighbors cells alive, create a new cell;
  // 2. Death Rule: A cell dies if has >=1 or <=4 neighbors;
  // 3. Survival Rule: A cell survives only if has 2 or 3 neighbors alive.
    const canvas = document.querySelector("#board");
    const ctx = canvas.getContext("2d");

    var gridDimension;
    var resolution;
    if (isMobile) {
      gridDimension = 2000;
      resolution = 20;
    } else {
      gridDimension = 1440;
      resolution = 12;
    }
  
    const GRID_WIDTH = gridDimension;
    const GRID_HEIGHT = gridDimension;
    const RES = resolution;
    const COL = GRID_WIDTH / RES;
    const ROW = GRID_HEIGHT / RES;
  
    canvas.width = GRID_WIDTH;
    canvas.height = GRID_HEIGHT;
  
    //Making a grid and filling with 0 or 1
    function createGrid(cols, rows) {

      var populateRow;
      if (isMobile) {
        populateRow = () =>
          new Array(rows).fill(null).map(() => 
            Math.round(Math.random()
          )
        )
      } else {
        populateRow = () =>
          new Array(rows).fill(null).map(() => 0
          )
      }

      return new Array(cols)
        .fill(null)
        .map(populateRow);
    }
  
    let grid = createGrid(COL, ROW);
  
    //Generate next generation
    function nextGen(grid) {
      const nextGen = grid.map((arr) => [...arr]); //make a copy of grid with spread operator
  
      for (let col = 0; col < grid.length; col++) {
        for (let row = 0; row < grid[col].length; row++) {
          const currentCell = grid[col][row];
          let sumNeighbors = 0; //to verify the total of neighbors
  
          //Verifying the 8 neigbours of current cell
          for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
              if (i === 0 && j === 0) {
                continue; // because this is the current cell's position
              }
  
              const x = col + i;
              const y = row + j;
  
              if (x >= 0 && y >= 0 && x < COL && y < ROW) {
                const currentNeighbor = grid[col + i][row + j];
                sumNeighbors += currentNeighbor;
              }
            }
          }
  
          //Applying rules
          if (currentCell === 0 && sumNeighbors === 3) {
            nextGen[col][row] = 1;
          } else if (
            currentCell === 1 &&
            (sumNeighbors < 2 || sumNeighbors > 3)
          ) {
            nextGen[col][row] = 0;
          }
        }
      }
      return nextGen;
    }
  
    //Draw cells on canvas
    function drawGrid(grid, cols, rows, reslution) {
      ctx.clearRect(0, 0, cols, rows);
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const cell = grid[i][j];
          ctx.fillStyle = cell ? "black" : "white";
          ctx.fillRect(i * reslution, j * reslution, reslution, reslution);
        }
      }
    }
  
    // Game of life ticker
    setInterval(update, 200);
    function update() {
      grid = nextGen(grid);
      drawGrid(grid, COL, ROW, RES);
      // requestAnimationFrame(update);
    }

    if (isMobile) {
      document.querySelector("#col1").style.display = "none";
      document.querySelector("#gol").style.backgroundColor = "black";
      document.querySelector("#col0").style.width = "100%";
      document.querySelector("#page1").style.width = "100%";
      document.querySelector("#page1").style.left = "0%";
      document.querySelector("#page1").style.top = "10%";
      // document.querySelector("#page1").style.border = "0.1em solid white";
      document.querySelector(".hovertxt").style.display = "none"
    } else {
      function getCellPositionBoard(x, y) {
        let offsetLeft = canvas.offsetLeft;
        let offsetTop = canvas.offsetTop;
        x = x - offsetLeft;
        y = y - offsetTop;
    
        let row = Math.floor(x / RES);
        let col = Math.floor(y / RES);
    
        return [row, col];
    
      }
    
      onmousemove = function(e){
        try {
          let coord = getCellPositionBoard(e.clientX, e.clientY);
          //   console.log("mouse location:", coord[0], coord[1]);
            grid[coord[0]][coord[1]] = 1;
            drawGrid(grid, COL, ROW, RES);
          } catch {}
      }
  
      const col1 = document.querySelector("#col1");
      col1.addEventListener("mouseenter", switchRickyAndI);
      col1.addEventListener("mouseleave", switchRickyAndI);
      col1.addEventListener("mousewheel", switchRickyAndI);
  
      function switchRickyAndI(e) {
        if (document.querySelector("#me").style.display !== "none") {
          document.querySelector("#me").style.display = "none";
          document.querySelector("#meWithRicky").style.display = "block";
        } else {
          document.querySelector("#me").style.display = "block";
          document.querySelector("#meWithRicky").style.display = "none";
        }
      }
  
      // const page1 = document.querySelector("#page1");
      // const button = document.querySelector("#windowAdjust");
      // button.addEventListener("click", (e) => {
      //   if (button.innerText === "_") {
      //     button.innerText = "+";
      //     button.style.fontWeight = "lighter";
      //     page1.style.width = "4vh";
      //     page1.style.height = "4vh";
      //     page1.style.overflowY = "hidden";
  
      //   } else {
      //     button.innerText = "_";
      //     button.style.fontWeight = "bold"
      //     page1.style.width = "35.75%";
      //     page1.style.height = "74vh";
      //     page1.style.overflowY = "scroll";
      //   }      
      // })
    }

    
  // Dynamic resize and reload for desktop
  window.addEventListener('resize', checkAndToggleMobile);

  });



