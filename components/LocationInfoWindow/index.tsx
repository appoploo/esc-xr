export function LocationInfoWindow() {
  return (
    <div>
      <div className="card w-2/6 bg-base-100 shadow-xl">
        <div className="card-body relative ">
          <div className="card-actions  absolute right-2 top-1">
            <button className="text-lg">✕</button>
          </div>
          <div className="grid grid-cols-[200px_1fr] gap-4">
            <picture>
              <img
                src="https://developers.google.com/static/maps/images/landing/hero_directions_api.png"
                width={200}
                height={200}
                alt="google map image"
              ></img>
            </picture>
            <div className="flex gap-4">
              <div className=" w-4/6 ">
                <h2 className="font-bold ">Χαλάνδρι</h2>
                <div className="divider"></div>
                <div className="flex gap-1">
                  <h2 className="text-blue-600">38.019760,</h2>
                  <h2 className="text-blue-600"> 23.801136</h2>
                </div>
              </div>
              <div className="flex justify-center items-center gap-4 ml-auto ">
                <button className="sharebtn w-12 h-12 flex z-10 bg-blue-700 border rounded-full p-2  ">
                  <picture>
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/105/105507.png"
                      alt="instructions sign"
                    ></img>
                  </picture>
                </button>
                <button
                  className="sharebtn w-12 h-12 flex z-10 bg-white border rounded-full p-2  "
                  title="click to enable menu"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    className="h-5 w-6 my-1 text-blue-700"
                  >
                    <path
                      fill="currentColor"
                      d="M352 320c-22.608 0-43.387 7.819-59.79 20.895l-102.486-64.054a96.551 96.551 0 0 0 0-41.683l102.486-64.054C308.613 184.181 329.392 192 352 192c53.019 0 96-42.981 96-96S405.019 0 352 0s-96 42.981-96 96c0 7.158.79 14.13 2.276 20.841L155.79 180.895C139.387 167.819 118.608 160 96 160c-53.019 0-96 42.981-96 96s42.981 96 96 96c22.608 0 43.387-7.819 59.79-20.895l102.486 64.054A96.301 96.301 0 0 0 256 416c0 53.019 42.981 96 96 96s96-42.981 96-96-42.981-96-96-96z"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
