# Loop-Triangulation
Implementation of the Loop Triangulation

In [Loo87] Charles Loop explained how to subdivide a mesh of triangles into smaller triangles in order to produce smoothier 3d objects.
An example was shown in [STA]:

![image](https://user-images.githubusercontent.com/101653815/170862539-4b3ddee3-6d7d-42bb-bf29-15a2c5d7d263.png)

The formula used to perform the Loop subdivision is described in [STA]:

![image](https://user-images.githubusercontent.com/101653815/170862634-9764e996-cf47-4a50-8cdb-faed0e07c46a.png)

It can be expressed for the example points (new) E6 and (moved) d1:

![image](https://user-images.githubusercontent.com/101653815/170858223-5e188bcd-242f-4536-a455-ad17c1271752.png)

<br><br>
My implementation is based on formulae above and the result is pretty much the same:

![image](https://user-images.githubusercontent.com/101653815/170863180-ed0835a0-5a05-4699-8415-e8f077cba356.png)


Reference
---------
[Loo87] Charles Loop: Smooth Subdivision Surfaces Based on Triangles, M.S. Mathematics thesis, University of Utah, 1987, https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/thesis-10.pdf

[STA] Subdivision Surfaces - Stanford University, p57-58, https://graphics.stanford.edu/courses/cs468-10-fall/LectureSlides/10_Subdivision.pdf

