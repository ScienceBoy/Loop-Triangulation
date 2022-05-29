// Function to apply Loop Subdivision
function loopSubdivision(points, triangles) {
  // Create new triangle list
  var triangleList_Corner1 = new Array();
  var triangleList_Corner2 = new Array();
  var triangleList_Corner3 = new Array();

  // Select triangle
  for (var tri = 0; tri < triangles.length; tri++) {
    // Select edge with corner1 and corner2 and edge with corner1 and corner3
    var EdgeEndPoint1 = triangles[tri].P1;
    var EdgeEndPoint2 = triangles[tri].P2;
    var EdgeEndPoint3 = triangles[tri].P3;
    // Find other triangle, which has a common edge with corner1 / corner2. Get position of other corner3'
    var OtherTriangle1 = FindTriangleWithSameEdge(tri, EdgeEndPoint1, EdgeEndPoint2, triangles);
    var OtherCornerOfOtherTriangle1 = FindOtherCornerOfTriangleDefinedByTwoCorners(tri, OtherTriangle1, EdgeEndPoint1, EdgeEndPoint2, triangles);
    // Take 3rd edge from triangle as the other point to calculate with
    var OtherCornerOfOtherTriangle2 = EdgeEndPoint3;
    // Create new points P1 at 3/8*(corner1+corner2)+1/8*(corner3'+corner2'') and add it to point list
    var P1x = (3 / 8) * (points[EdgeEndPoint1].x + points[EdgeEndPoint2].x) + (1 / 8) * (points[OtherCornerOfOtherTriangle1].x + points[OtherCornerOfOtherTriangle2].x);
    var P1y = (3 / 8) * (points[EdgeEndPoint1].y + points[EdgeEndPoint2].y) + (1 / 8) * (points[OtherCornerOfOtherTriangle1].y + points[OtherCornerOfOtherTriangle2].y);
    var P1z = (3 / 8) * (points[EdgeEndPoint1].z + points[EdgeEndPoint2].z) + (1 / 8) * (points[OtherCornerOfOtherTriangle1].z + points[OtherCornerOfOtherTriangle2].z);
    points.push({ x: P1x, y: P1y, z: P1z });

    // Select edge with corner1 and corner3 and edge with corner2 and corner3
    // Find other triangle, which has a common edge with corner1 / corner3. Get position of other corner2'
    var OtherTriangle1 = FindTriangleWithSameEdge(tri, EdgeEndPoint1, EdgeEndPoint3, triangles);
    var OtherCornerOfOtherTriangle1 = FindOtherCornerOfTriangleDefinedByTwoCorners(tri, OtherTriangle1, EdgeEndPoint1, EdgeEndPoint3, triangles);
    // Take 3rd edge from triangle as the other point to calculate with
    var OtherCornerOfOtherTriangle2 = EdgeEndPoint2;
    // Create new points P2 at 3/8*(corner1+corner3)+1/8*(corner2'+corner1'') and add it to point list
    var P2x = (3 / 8) * (points[EdgeEndPoint1].x + points[EdgeEndPoint3].x) + (1 / 8) * (points[OtherCornerOfOtherTriangle1].x + points[OtherCornerOfOtherTriangle2].x);
    var P2y = (3 / 8) * (points[EdgeEndPoint1].y + points[EdgeEndPoint3].y) + (1 / 8) * (points[OtherCornerOfOtherTriangle1].y + points[OtherCornerOfOtherTriangle2].y);
    var P2z = (3 / 8) * (points[EdgeEndPoint1].z + points[EdgeEndPoint3].z) + (1 / 8) * (points[OtherCornerOfOtherTriangle1].z + points[OtherCornerOfOtherTriangle2].z);
    points.push({ x: P2x, y: P2y, z: P2z });

    // Select edge with corner2 and corner3 and edge with corner1 and corner2
    // Find other triangle, which has a common edge with corner2 / corner3. Get position of other corner1'
    var OtherTriangle1 = FindTriangleWithSameEdge(tri, EdgeEndPoint2, EdgeEndPoint3, triangles);
    var OtherCornerOfOtherTriangle1 = FindOtherCornerOfTriangleDefinedByTwoCorners(tri, OtherTriangle1, EdgeEndPoint2, EdgeEndPoint3, triangles);
    // Take 3rd edge from triangle as the other point to calculate with
    var OtherCornerOfOtherTriangle2 = EdgeEndPoint1;
    // Create new points P3 at 3/8*(corner2+corner3)+1/8*(corner1'+corner3'') and add it to point list
    var P3x = (3 / 8) * (points[EdgeEndPoint2].x + points[EdgeEndPoint3].x) + (1 / 8) * (points[OtherCornerOfOtherTriangle1].x + points[OtherCornerOfOtherTriangle2].x);
    var P3y = (3 / 8) * (points[EdgeEndPoint2].y + points[EdgeEndPoint3].y) + (1 / 8) * (points[OtherCornerOfOtherTriangle1].y + points[OtherCornerOfOtherTriangle2].y);
    var P3z = (3 / 8) * (points[EdgeEndPoint2].z + points[EdgeEndPoint3].z) + (1 / 8) * (points[OtherCornerOfOtherTriangle1].z + points[OtherCornerOfOtherTriangle2].z);
    points.push({ x: P3x, y: P3y, z: P3z });

    // Create new position of 1st corner of the triangle
    var n = 0;
    var sum_x = 0;
    var sum_y = 0;
    var sum_z = 0;
    for (var trian = 0; trian < triangles.length; trian++) {
      // Select corner1 of the triangle and count number n of triangles, which share the corner1
      if (triangles[trian].P1 == EdgeEndPoint1) {
        n++;
        // Sum positions of all corner2 of the n neighbor triangles
        sum_x += points[triangles[trian].P2].x;
        sum_y += points[triangles[trian].P2].y;
        sum_z += points[triangles[trian].P2].z;
      } else if (triangles[trian].P2 == EdgeEndPoint1) {
        n++;
        // Sum positions of all corner3 of the n neighbor triangles
        sum_x += points[triangles[trian].P3].x;
        sum_y += points[triangles[trian].P3].y;
        sum_z += points[triangles[trian].P3].z;
      } else if (triangles[trian].P3 == EdgeEndPoint1) {
        n++;
        // Sum positions of all corner1 of the n neighbor triangles
        sum_x += points[triangles[trian].P1].x;
        sum_y += points[triangles[trian].P1].y;
        sum_z += points[triangles[trian].P1].z;
      }
    }
    // Loop Formula I
    // Save cornerA as alpha*corner1 + (1-alpha)/n+sum, where alpha = 3/8+(3/8+1/4*cos(2*pi/n)^2)
    var alpha = 3 / 8 + Math.pow(3 / 8 + (1 / 4) * Math.cos((2 * Math.PI) / n), 2);
    var cornerAx = alpha * points[triangles[tri].P1].x + ((1 - alpha) / n) * sum_x;
    var cornerAy = alpha * points[triangles[tri].P1].y + ((1 - alpha) / n) * sum_y;
    var cornerAz = alpha * points[triangles[tri].P1].z + ((1 - alpha) / n) * sum_z;
    // Loop Formula II (in some books written as following)
    /*var s = (1 / n) * Math.pow(5 / 8 - (3 / 8 + (1 / 4) * Math.cos((2 * Math.PI) / n)), 2);
    var cornerAx = (1 - n * s) * points[triangles[tri].P1].x + s * sum_x;
    var cornerAy = (1 - n * s) * points[triangles[tri].P1].y + s * sum_y;
    var cornerAz = (1 - n * s) * points[triangles[tri].P1].z + s * sum_z;*/
    points.push({ x: cornerAx, y: cornerAy, z: cornerAz });

    // Create new position of 2nd corner of the triangle
    var n = 0;
    var sum_x = 0;
    var sum_y = 0;
    var sum_z = 0;
    for (var trian = 0; trian < triangles.length; trian++) {
      // Select corner1 of the triangle and count number n of triangles, which share the corner1
      if (triangles[trian].P1 == EdgeEndPoint2) {
        n++;
        // Sum positions of all corner2 of the n neighbor triangles
        sum_x += points[triangles[trian].P2].x;
        sum_y += points[triangles[trian].P2].y;
        sum_z += points[triangles[trian].P2].z;
      } else if (triangles[trian].P2 == EdgeEndPoint2) {
        n++;
        // Sum positions of all corner3 of the n neighbor triangles
        sum_x += points[triangles[trian].P3].x;
        sum_y += points[triangles[trian].P3].y;
        sum_z += points[triangles[trian].P3].z;
      } else if (triangles[trian].P3 == EdgeEndPoint2) {
        n++;
        // Sum positions of all corner1 of the n neighbor triangles
        sum_x += points[triangles[trian].P1].x;
        sum_y += points[triangles[trian].P1].y;
        sum_z += points[triangles[trian].P1].z;
      }
    }
    // Loop Formula I
    // Save cornerB as alpha*corner1 + (1-alpha)/n+sum, where alpha = 3/8+(3/8+1/4*cos(2*pi/n)^2)
    var alpha = 3 / 8 + Math.pow(3 / 8 + (1 / 4) * Math.cos((2 * Math.PI) / n), 2);
    var cornerBx = alpha * points[triangles[tri].P2].x + ((1 - alpha) / n) * sum_x;
    var cornerBy = alpha * points[triangles[tri].P2].y + ((1 - alpha) / n) * sum_y;
    var cornerBz = alpha * points[triangles[tri].P2].z + ((1 - alpha) / n) * sum_z;
    // Loop Formula II (in some books written as following)
    /*var s = (1 / n) * Math.pow(5 / 8 - (3 / 8 + (1 / 4) * Math.cos((2 * Math.PI) / n)), 2);
    var cornerBx = (1 - n * s) * points[triangles[tri].P2].x + s * sum_x;
    var cornerBy = (1 - n * s) * points[triangles[tri].P2].y + s * sum_y;
    var cornerBz = (1 - n * s) * points[triangles[tri].P2].z + s * sum_z;*/
    points.push({ x: cornerBx, y: cornerBy, z: cornerBz });

    // Create new position of 3rd corner of the triangle
    var n = 0;
    var sum_x = 0;
    var sum_y = 0;
    var sum_z = 0;
    for (var trian = 0; trian < triangles.length; trian++) {
      // Select corner1 of the triangle and count number n of triangles, which share the corner1
      if (triangles[trian].P1 == EdgeEndPoint3) {
        n++;
        // Sum positions of all corner2 of the n neighbor triangles
        sum_x += points[triangles[trian].P2].x;
        sum_y += points[triangles[trian].P2].y;
        sum_z += points[triangles[trian].P2].z;
      } else if (triangles[trian].P2 == EdgeEndPoint3) {
        n++;
        // Sum positions of all corner3 of the n neighbor triangles
        sum_x += points[triangles[trian].P3].x;
        sum_y += points[triangles[trian].P3].y;
        sum_z += points[triangles[trian].P3].z;
      } else if (triangles[trian].P3 == EdgeEndPoint3) {
        n++;
        // Sum positions of all corner1 of the n neighbor triangles
        sum_x += points[triangles[trian].P1].x;
        sum_y += points[triangles[trian].P1].y;
        sum_z += points[triangles[trian].P1].z;
      }
    }
    // Loop Formula I
    // Save cornerC as alpha*corner1 + (1-alpha)/n+sum, where alpha = 3/8+(3/8+1/4*cos(2*pi/n)^2)
    var alpha = 3 / 8 + Math.pow(3 / 8 + (1 / 4) * Math.cos((2 * Math.PI) / n), 2);
    var cornerCx = alpha * points[triangles[tri].P3].x + ((1 - alpha) / n) * sum_x;
    var cornerCy = alpha * points[triangles[tri].P3].y + ((1 - alpha) / n) * sum_y;
    var cornerCz = alpha * points[triangles[tri].P3].z + ((1 - alpha) / n) * sum_z;
    // Loop Formula II (in some books written as following)
    /*var s = (1 / n) * Math.pow(5 / 8 - (3 / 8 + (1 / 4) * Math.cos((2 * Math.PI) / n)), 2);
    var cornerCx = (1 - n * s) * points[triangles[tri].P3].x + s * sum_x;
    var cornerCy = (1 - n * s) * points[triangles[tri].P3].y + s * sum_y;
    var cornerCz = (1 - n * s) * points[triangles[tri].P3].z + s * sum_z;*/
    points.push({ x: cornerCx, y: cornerCy, z: cornerCz });

    // Add to new triangle list triangle (cornerA, P1, P2)
    triangleList_Corner1.push(FindPointInPointList(cornerAx, cornerAy, cornerAz, points));
    triangleList_Corner2.push(FindPointInPointList(P1x, P1y, P1z, points));
    triangleList_Corner3.push(FindPointInPointList(P2x, P2y, P2z, points));
    // Add to new triangle list triangle (cornerB, P1, P3)
    triangleList_Corner1.push(FindPointInPointList(cornerBx, cornerBy, cornerBz, points));
    triangleList_Corner2.push(FindPointInPointList(P3x, P3y, P3z, points));
    triangleList_Corner3.push(FindPointInPointList(P1x, P1y, P1z, points));
    // Add to new triangle list triangle (cornerC, P2, P3)
    triangleList_Corner1.push(FindPointInPointList(cornerCx, cornerCy, cornerCz, points));
    triangleList_Corner2.push(FindPointInPointList(P2x, P2y, P2z, points));
    triangleList_Corner3.push(FindPointInPointList(P3x, P3y, P3z, points));
    // Add to new triangle list triangle (P1, P2, P3)
    triangleList_Corner1.push(FindPointInPointList(P1x, P1y, P1z, points));
    triangleList_Corner2.push(FindPointInPointList(P2x, P2y, P2z, points));
    triangleList_Corner3.push(FindPointInPointList(P3x, P3y, P3z, points));
  }
  var trianglesNew = new Array();

  for (var NumberOfTrian = 0; NumberOfTrian < triangleList_Corner1.length; NumberOfTrian++) {
    trianglesNew[NumberOfTrian] = { P1: triangleList_Corner1[NumberOfTrian], P2: triangleList_Corner2[NumberOfTrian], P3: triangleList_Corner3[NumberOfTrian] };
  }
  return { triangles: trianglesNew, points: points };
}

// Function to return the number of the triangle, which has the shares the same edge
function FindTriangleWithSameEdge(tri, EdgeEndPnt1, EdgeEndPnt2, triangles) {
  for (var triang = 0; triang < triangles.length; triang++) {
    if (triang != tri) {
      if ((triangles[triang].P1 == EdgeEndPnt1 && triangles[triang].P2 == EdgeEndPnt2) || (triangles[triang].P1 == EdgeEndPnt1 && triangles[triang].P3 == EdgeEndPnt2) || (triangles[triang].P2 == EdgeEndPnt1 && triangles[triang].P3 == EdgeEndPnt2)) {
        return triang;
      }
      if ((triangles[triang].P1 == EdgeEndPnt2 && triangles[triang].P2 == EdgeEndPnt1) || (triangles[triang].P1 == EdgeEndPnt2 && triangles[triang].P3 == EdgeEndPnt1) || (triangles[triang].P2 == EdgeEndPnt2 && triangles[triang].P3 == EdgeEndPnt1)) {
        return triang;
      }
    }
  }
  console.log("Triangle with same edge not found for triangle: ", tri, " with edge: ", EdgeEndPnt1, EdgeEndPnt2);
  return -1;
}

// Function to find the 3rd corner of a triangle, for which we know two corners already
function FindOtherCornerOfTriangleDefinedByTwoCorners(tri, OtherTriangle1, EdgeEndPnt1, EdgeEndPnt2, triangles) {
  for (var triang = 0; triang < triangles.length; triang++) {
    if (triang != tri) {
      if ((triangles[triang].P1 == EdgeEndPnt1 && triangles[triang].P2 == EdgeEndPnt2) || (triangles[triang].P2 == EdgeEndPnt1 && triangles[triang].P1 == EdgeEndPnt2)) {
        return triangles[triang].P3;
      }
      if ((triangles[triang].P1 == EdgeEndPnt1 && triangles[triang].P3 == EdgeEndPnt2) || (triangles[triang].P3 == EdgeEndPnt1 && triangles[triang].P1 == EdgeEndPnt2)) {
        return triangles[triang].P2;
      }
      if ((triangles[triang].P2 == EdgeEndPnt1 && triangles[triang].P3 == EdgeEndPnt2) || (triangles[triang].P3 == EdgeEndPnt1 && triangles[triang].P2 == EdgeEndPnt2)) {
        return triangles[triang].P1;
      }
    }
  }
  console.log("Other corner of Triangle with defined two corners not found for triangle: ", tri, " with: ", OtherTriangle1, EdgeEndPnt1, EdgeEndPnt2);
  return -1;
}

// Function to return the number of a point in the pointlist
function FindPointInPointList(pointX, pointY, pointZ, points) {
  for (var poi = 0; poi < points.length; poi++) {
    if (Math.abs(points[poi].x - pointX) < 1e-6 && Math.abs(points[poi].y - pointY) < 1e-6 && Math.abs(points[poi].z - pointZ) < 1e-6) {
      return poi;
    }
  }
  console.log("Point not found for: ", pointX, pointY, pointZ);
  return -1;
}
