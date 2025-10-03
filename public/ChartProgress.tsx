import * as React from 'react'

const ChartProgress = (props:any) => (
  <svg
    viewBox="0 0 822 600"
    height={600}
    width={822}
    xmlns="http://www.w3.org/2000/svg"
    className="highcharts-root"
    {...props}
    style={
      'block-size:600px;border:0px solid rgb(229, 231, 235);border-block:0px solid rgb(229, 231, 235);border-block-color:rgb(229, 231, 235);border-block-end:0px solid rgb(229, 231, 235);border-block-end-color:rgb(229, 231, 235);border-block-end-style:solid;border-block-start:0px solid rgb(229, 231, 235);border-block-start-color:rgb(229, 231, 235);border-block-start-style:solid;border-block-style:solid;border-bottom:0px solid rgb(229, 231, 235);border-bottom-color:rgb(229, 231, 235);border-bottom-style:solid;border-color:rgb(229, 231, 235);border-inline:0px solid rgb(229, 231, 235);border-inline-color:rgb(229, 231, 235);border-inline-end:0px solid rgb(229, 231, 235);border-inline-end-color:rgb(229, 231, 235);border-inline-end-style:solid;border-inline-start:0px solid rgb(229, 231, 235);border-inline-start-color:rgb(229, 231, 235);border-inline-start-style:solid;border-inline-style:solid;border-left:0px solid rgb(229, 231, 235);border-left-color:rgb(229, 231, 235);border-left-style:solid;border-right:0px solid rgb(229, 231, 235);border-right-color:rgb(229, 231, 235);border-right-style:solid;border-style:solid;border-top:0px solid rgb(229, 231, 235);border-top-color:rgb(229, 231, 235);border-top-style:solid;box-sizing:border-box;display:block;font-family:Inter, -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, Roboto, Helvetica, Arial, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;;font-feature-settings:&quot;liga&quot;, &quot;calt&quot;, &quot;cv10&quot;, &quot;cv06&quot;, &quot;cv05&quot;, &quot;cv01&quot;;font-size:13px;inline-size:822px;line-height:18.525px;tab-size:4;text-align:left;transform-origin:411px 300px;user-select:none;vertical-align:middle;webkit-border-after:0px solid rgb(229, 231, 235);webkit-border-after-color:rgb(229, 231, 235);webkit-border-after-style:solid;webkit-border-before:0px solid rgb(229, 231, 235);webkit-border-before-color:rgb(229, 231, 235);webkit-border-before-style:solid;webkit-border-end:0px solid rgb(229, 231, 235);webkit-border-end-color:rgb(229, 231, 235);webkit-border-end-style:solid;webkit-border-start:0px solid rgb(229, 231, 235);webkit-border-start-color:rgb(229, 231, 235);webkit-border-start-style:solid;webkit-box-sizing:border-box;webkit-font-feature-settings:&quot;liga&quot;, &quot;calt&quot;, &quot;cv10&quot;, &quot;cv06&quot;, &quot;cv05&quot;, &quot;cv01&quot;;webkit-locale:&quot;en&quot;;webkit-perspective-origin:411px 300px;webkit-transform-origin:411px 300px;webkit-user-select:none;'
    }
  >
    <defs>
      <linearGradient y2={1} x2={0} y1={0} x1={0} id="a">
        <stop
          style={{
            stopColor: '#00a83e',
            stopOpacity: 0.4,
          }}
          offset={0}
        />
        <stop
          style={{
            stopColor: '#00a83e',
            stopOpacity: 0,
          }}
          offset={1}
        />
      </linearGradient>
      <clipPath id="b">
        <path d="M0 0h760v358H0z" />
      </clipPath>
    </defs>
    <g
      data-z-index={3}
      className="highcharts-series-group"
      stroke="#00A83E"
      fill="url(#a)"
      transform="translate(10 50)"
    >
      <g
        style={{
          transform: 'matrix(1,0,0,1,10,50)',
        }}
        clipPath="url(#b)"
        data-z-index={0.1}
        className="highcharts-series highcharts-series-0 highcharts-area-series highcharts-color-positive"
      >
        <path
          style={{
            fillOpacity: 0.75,
          }}
          data-z-index={0}
          className="highcharts-area"
          d="m2.171 312.512 4.343.17 4.343-1.675 4.343-3.065 4.343-5.048 4.343-4.2 4.343 1.817 4.342.9 4.343-3.909 4.343 1.438 4.343-1.218 4.343-1.455 4.343-.2 4.343-3.02 4.342-16.202 4.343.29 4.343.726L76 283.235l4.343-6.64 4.343-12.278 4.343 10.828 4.342-.326 4.343-.502 4.343-4.34 4.343 7.276 4.343 6.228 4.343-8.021 4.343 1.452 4.342-.354 4.343-2.778 4.343 1.657 4.343 3.628 4.343-4.431 4.343-1.312 4.343-.068 4.342-.921 4.343-5.325 4.343.752 4.343 2.099 4.343.929 4.343-1.904 4.343-7.822 4.342-10.236 4.343 3.465 4.343-2.866 4.343 6.045 4.343 2.396 4.343-3.163 4.343-7.042 4.342 4.35 4.343-1.105 4.343 3.289 4.343-4.651 4.343 2.476 4.343-13.585 4.343-16.954 4.342-5.929 4.343-13.692 4.343-6.886 4.343-12.886 4.343 13.062 4.343 7.659 4.343 6.764 4.342-5.727 4.343 6.106 4.343.939 4.343-11.615 4.343 3.982 4.343 11.52 4.343-8.91 4.342 7.225 4.343 8.763 4.343 6.804 4.343-12.507 4.343-1.565 4.343-5.244 4.343 3.476 4.342 12.152 4.343-5.919 4.343 2.17 4.343-.4 4.343-4.524 4.343-5.649 4.343 10.34 4.342 1.368 4.343 1.053 4.343 2.045L380 238.519l4.343-.947 4.343-6.983 4.343 2.85 4.342-7.705 4.343-2.448 4.343-2.71 4.343-7.81 4.343-.101 4.343 6.529 4.343-1.23 4.342-3.83 4.343 3.863 4.343 3.287 4.343-.28 4.343-1.793 4.343-5.645 4.343-2.924 4.342-5.915 4.343-2.803 4.343 2.245 4.343-6.606 4.343-.805 4.343-6.268 4.343 4.836 4.342 4.436 4.343 2.252 4.343-4.706 4.343 1.342 4.343 3.886 4.343 4.613 4.343 4.727 4.342 2.792 4.343-5.866 4.343 1.074 4.343-9.174 4.343 2.389 4.343-13.251 4.343-11.816 4.342-6.251 4.343.236 4.343-.607 4.343-4.322 4.343 9.928 4.343-6.123 4.343-19.243 4.342-1.556 4.343.536 4.343.801 4.343-6.495 4.343-2.773 4.343-18.467 4.343-18.04 4.342-11.028 4.343 4.472 4.343-31.1 4.343 8.842 4.343 38.302 4.343-31.28 4.343 17.022 4.342 8.734 4.343.002 4.343-15.133 4.343-7.124 4.343-3.207 4.343 7.299 4.343-4.92 4.342-3.512 4.343-3.514 4.343-11.933L684 82.017l4.343 16.16 4.343-5.829 4.343 2.42 4.342 12.391 4.343-5.43 4.343-.89 4.343-1.52 4.343 11.594 4.343-.824 4.343.61 4.342 27.105 4.343 19.457 4.343-16.276 4.343 18.806 4.343 2.861 4.343 5.563 4.343-13.748V358H2.17Z"
          stroke="none"
        />
        <path
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
          data-z-index={1}
          className="highcharts-graph"
          d="m2.171 312.512 4.343.17 4.343-1.675 4.343-3.065 4.343-5.048 4.343-4.2 4.343 1.817 4.342.9 4.343-3.909 4.343 1.438 4.343-1.218 4.343-1.455 4.343-.2 4.343-3.02 4.342-16.202 4.343.29 4.343.726L76 283.235l4.343-6.64 4.343-12.278 4.343 10.828 4.342-.326 4.343-.502 4.343-4.34 4.343 7.276 4.343 6.228 4.343-8.021 4.343 1.452 4.342-.354 4.343-2.778 4.343 1.657 4.343 3.628 4.343-4.431 4.343-1.312 4.343-.068 4.342-.921 4.343-5.325 4.343.752 4.343 2.099 4.343.929 4.343-1.904 4.343-7.822 4.342-10.236 4.343 3.465 4.343-2.866 4.343 6.045 4.343 2.396 4.343-3.163 4.343-7.042 4.342 4.35 4.343-1.105 4.343 3.289 4.343-4.651 4.343 2.476 4.343-13.585 4.343-16.954 4.342-5.929 4.343-13.692 4.343-6.886 4.343-12.886 4.343 13.062 4.343 7.659 4.343 6.764 4.342-5.727 4.343 6.106 4.343.939 4.343-11.615 4.343 3.982 4.343 11.52 4.343-8.91 4.342 7.225 4.343 8.763 4.343 6.804 4.343-12.507 4.343-1.565 4.343-5.244 4.343 3.476 4.342 12.152 4.343-5.919 4.343 2.17 4.343-.4 4.343-4.524 4.343-5.649 4.343 10.34 4.342 1.368 4.343 1.053 4.343 2.045L380 238.519l4.343-.947 4.343-6.983 4.343 2.85 4.342-7.705 4.343-2.448 4.343-2.71 4.343-7.81 4.343-.101 4.343 6.529 4.343-1.23 4.342-3.83 4.343 3.863 4.343 3.287 4.343-.28 4.343-1.793 4.343-5.645 4.343-2.924 4.342-5.915 4.343-2.803 4.343 2.245 4.343-6.606 4.343-.805 4.343-6.268 4.343 4.836 4.342 4.436 4.343 2.252 4.343-4.706 4.343 1.342 4.343 3.886 4.343 4.613 4.343 4.727 4.342 2.792 4.343-5.866 4.343 1.074 4.343-9.174 4.343 2.389 4.343-13.251 4.343-11.816 4.342-6.251 4.343.236 4.343-.607 4.343-4.322 4.343 9.928 4.343-6.123 4.343-19.243 4.342-1.556 4.343.536 4.343.801 4.343-6.495 4.343-2.773 4.343-18.467 4.343-18.04 4.342-11.028 4.343 4.472 4.343-31.1 4.343 8.842 4.343 38.302 4.343-31.28 4.343 17.022 4.342 8.734 4.343.002 4.343-15.133 4.343-7.124 4.343-3.207 4.343 7.299 4.343-4.92 4.342-3.512 4.343-3.514 4.343-11.933L684 82.017l4.343 16.16 4.343-5.829 4.343 2.42 4.342 12.391 4.343-5.43 4.343-.89 4.343-1.52 4.343 11.594 4.343-.824 4.343.61 4.342 27.105 4.343 19.457 4.343-16.276 4.343 18.806 4.343 2.861 4.343 5.563 4.343-13.748"
        />
      </g>
      <g
        style={{
          transform: 'matrix(1,0,0,1,10,50)',
        }}
        data-z-index={0.1}
        className="highcharts-markers highcharts-series-0 highcharts-area-series highcharts-color-positive"
      />
    </g>
  </svg>
)
export default ChartProgress;
