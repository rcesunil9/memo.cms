import React from 'react'

const PageNotFound = () => (
  <div>
    <div className="container">
      <div className="error">
           <div className="col ground-color text-center">
               <div className="container-error-404">
                   <div className="clip">
                      <div className="shadow">
                        <span className="digit thirdDigit bg-surprise">4</span>
                      </div>
                    </div>
                   <div className="clip">
                      <div className="shadow">
                        <span className="digit secondDigit">0</span>
                      </div>
                   </div>
                   <div className="clip">
                      <div className="shadow">
                      <span className="digit firstDigit bg-surprise">4</span>
                   </div>
                  </div>
               </div>
               <h2 className="h1">Page not found</h2>
           </div>
       </div>
    </div>
  </div>
)

export default PageNotFound
