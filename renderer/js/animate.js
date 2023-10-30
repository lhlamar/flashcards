function animate({ duration, draw, timing }) {
    //performance.now() returns time from start of process until
    //the time called.
    let start = performance.now();
  
    //initiates the animation using
    //invokes a callback function on the next repaint of the
    //browser
    //time is the obtained by performance.now()
    requestAnimationFrame(function animate(time) {
      //calculates the time fraction(progress) of the
      //animation based on the difference between
      //the current time ('time') and the start time,
      //divided by the specified duration
      let timeFraction = (time - start) / duration;
      if (timeFraction > 1) timeFraction = 1;
  
      //uses specified timing function to calculate the timing of
      //the animation
      let progress = timing(timeFraction);
  
      draw(progress);
  
      //if timefraction has not exceeded 1, then the animation
      //continues
      if (timeFraction < 1) {
        requestAnimationFrame(animate);
      }
    });
  }

  export {animate};