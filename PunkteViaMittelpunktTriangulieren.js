// Define central points
var CentralPoint_x = 0;
var CentralPoint_y = 0;

// Function to create triangulation starting from central point to each (ordered) point around the central point
function PorathTriangulation(points, triangles) {
  // Create initial point set
  createTriangles(points);
  // For each triangles, recursively repeat the creation of sub-triangles
  var NumberOfTriangles = triangles.length;
  // Create a new set of points from triangle corners and create sub-triangles with this set of points
  for (var NewTriangle = 0; NewTriangle < NumberOfTriangles; NewTriangle++) {
    points = [];
    points.push({
      x: triangles[NewTriangle].P1x,
      y: triangles[NewTriangle].P1y,
    });
    points.push({
      x: triangles[NewTriangle].P2x,
      y: triangles[NewTriangle].P2y,
    });
    points.push({
      x: triangles[NewTriangle].P3x,
      y: triangles[NewTriangle].P3y,
    });
    createTriangles(points);
    drawTriangles();
  }
  // Remove parent triangle
  for (var TriangleToDelete = NumberOfTriangles - 1; TriangleToDelete >= 0; TriangleToDelete--) {
    triangles.splice(TriangleToDelete, 1);
  }

  // Prepare points and corners
  var pointlistX = [];
  var pointlistY = [];
  var points_x = new Array();
  var points_y = new Array();
  var triangles_Corner1 = new Array();
  var triangles_Corner2 = new Array();
  var triangles_Corner3 = new Array();

  for (var NewTriangle = 0; NewTriangle < triangles.length; NewTriangle++) {
    triangles_Corner1.push(PointNumber(triangles[NewTriangle].P1x, triangles[NewTriangle].P1y));
    triangles_Corner2.push(PointNumber(triangles[NewTriangle].P2x, triangles[NewTriangle].P2y));
    triangles_Corner3.push(PointNumber(triangles[NewTriangle].P3x, triangles[NewTriangle].P3y));
  }
  for (var x2 = 0; x2 < pointlistX.length; x2++) {
    points_x.push(pointlistX[x2]);
    points_y.push(pointlistY[x2]);
  }
}

// Function to calculate a ordered index list based on list of input numbers
function SortAngles(toSort, OrderIndex) {
  for (var x6 = 0; x6 < toSort.length; x6++) {
    OrderIndex[x6] = x6;
  }
  OrderIndex.sort(function (a, b) {
    return toSort[b] - toSort[a];
  });
}

// Function to create triangles based on a list of points in the array pointsHere
function createTriangles(pointsHere) {
  var AngleToCentralPoint = [];
  var OrderIndex = [];
  var sum_x = 0;
  var sum_y = 0;

  // Calculate the coordinates of the central point to the input points
  for (var x3 = 0; x3 < pointsHere.length; x3++) {
    sum_x += pointsHere[x3].x;
    sum_y += pointsHere[x3].y;
  }
  CentralPoint_x = sum_x / pointsHere.length;
  CentralPoint_y = sum_y / pointsHere.length;

  // Move the central point by a fraction of 1, to avoid two equal angles
  CentralPoint_x = CentralPoint_x * (1 + Math.random() / 100);
  CentralPoint_y = CentralPoint_y * (1 + Math.random() / 100);

  // Calculate the angles for each point
  for (var x4 = 0; x4 < pointsHere.length; x4++) {
    var Hypothenuse = Distance(pointsHere[x4].x, pointsHere[x4].y, CentralPoint_x, CentralPoint_y);

    var AdjacentSide = Math.abs(pointsHere[x4].x - CentralPoint_x);

    if (pointsHere[x4].x > CentralPoint_x && pointsHere[x4].y > CentralPoint_y) AngleToCentralPoint[x4] = Math.asin(AdjacentSide / Hypothenuse) + Math.PI / 2 + Math.PI;

    if (pointsHere[x4].x < CentralPoint_x && pointsHere[x4].y > CentralPoint_y) AngleToCentralPoint[x4] = -Math.asin(-AdjacentSide / -Hypothenuse) + Math.PI + Math.PI / 2;

    if (pointsHere[x4].x < CentralPoint_x && pointsHere[x4].y < CentralPoint_y) AngleToCentralPoint[x4] = Math.asin(-AdjacentSide / -Hypothenuse) + Math.PI / 2;

    if (pointsHere[x4].x > CentralPoint_x && pointsHere[x4].y < CentralPoint_y) AngleToCentralPoint[x4] = Math.PI / 2 - Math.asin(AdjacentSide / Hypothenuse);
  }

  // Call the sorting function to receive an ordered index list in the array OrderIndex
  SortAngles(AngleToCentralPoint, OrderIndex);

  // Create triangles based on the ordered index list
  for (var x4 = 0; x4 < pointsHere.length - 1; x4++) {
    triangles.push({
      P1x: CentralPoint_x,
      P1y: CentralPoint_y,
      P2x: pointsHere[OrderIndex[x4]].x,
      P2y: pointsHere[OrderIndex[x4]].y,
      P3x: pointsHere[OrderIndex[x4 + 1]].x,
      P3y: pointsHere[OrderIndex[x4 + 1]].y,
      ID: triangles.length,
    });
  }
  // Create the last triangle with one corner being the first point (indexed with OrderIndex[0])
  triangles.push({
    P1x: pointsHere[OrderIndex[pointsHere.length - 1]].x,
    P1y: pointsHere[OrderIndex[pointsHere.length - 1]].y,
    P2x: pointsHere[OrderIndex[0]].x,
    P2y: pointsHere[OrderIndex[0]].y,
    P3x: CentralPoint_x,
    P3y: CentralPoint_y,
    ID: triangles.length,
  });
}

// Function to get the point number of the point matching the coordinates TriangleValueX / TriangleValueY
function PointNumber(TriangleValueX, TriangleValueY) {
  pointlistX = [];
  pointlistY = [];
  var FoundInList = false;
  var FoundNumber = -1;

  // Create list of all points, starting with central point, then checking 1st, 2nd and 3rs corner of the triangle for points not yet in point list
  pointlistX.push(CentralPoint_x);
  pointlistY.push(CentralPoint_y);
  for (var x31 = 0; x31 < triangles.length; x31++) {
    for (var x312 = 0; x312 < pointlistX.length; x312++) {
      if (Math.abs(pointlistX[x312] - triangles[x31].P1x) < 1e-6 && Math.abs(pointlistY[x312] - triangles[x31].P1y) < 1e-6) {
        FoundInList = true;
      }
    }
    if (FoundInList == false) {
      pointlistX.push(triangles[x31].P1x);
      pointlistY.push(triangles[x31].P1y);
    }
    FoundInList = false;
    for (var x312 = 0; x312 < pointlistX.length; x312++) {
      if (Math.abs(pointlistX[x312] - triangles[x31].P2x) < 1e-6 && Math.abs(pointlistY[x312] - triangles[x31].P2y) < 1e-6) {
        FoundInList = true;
      }
    }
    if (FoundInList == false) {
      pointlistX.push(triangles[x31].P2x);
      pointlistY.push(triangles[x31].P2y);
    }
    FoundInList = false;
    for (var x312 = 0; x312 < pointlistX.length; x312++) {
      if (Math.abs(pointlistX[x312] - triangles[x31].P3x) < 1e-6 && Math.abs(pointlistY[x312] - triangles[x31].P3y) < 1e-6) {
        FoundInList = true;
      }
    }
    if (FoundInList == false) {
      pointlistX.push(triangles[x31].P3x);
      pointlistY.push(triangles[x31].P3y);
    }
  }

  // From created point list check each point whether it is the one that matches the tranferred TriangleValueX or TriangleValueY
  for (var x2 = 0; x2 < pointlistX.length; x2++) {
    if (Math.abs(pointlistX[x2] - TriangleValueX) < 1e-6 && Math.abs(pointlistY[x2] - TriangleValueY) < 1e-6) {
      FoundNumber = x2;
    }
  }

  // Return the number of the matched point (or -1 if no point was found, which should not happen at all)
  return FoundNumber;
}
