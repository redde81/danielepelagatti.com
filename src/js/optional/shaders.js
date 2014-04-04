THREE.PlaneShader = {
	uniforms: THREE.UniformsUtils.merge([
		THREE.UniformsLib["fog"],
		THREE.UniformsLib["common"],
		{
		"wrapRGB": {type: "v3",value: new THREE.Vector3(1, 1, 1)},
		"emissive": {type: "c",value: new THREE.Color(0x000000)},
		"ambient": {type: "c",value: new THREE.Color(0xffffff)},
		"opacity" : { type: "f", value: -1 },
		"color_opacity" : { type: "f", value: -1 },
		"fresnelIntensity" : { type: "f", value: -1 },
		"fresnelColor" : { type: "v3", value: new THREE.Vector3( 0, 0, 0 ) },
		"diffuse" : { type: "v3", value: new THREE.Vector3( 0, 0, 0 ) },
		}
	]),
	vertexShader: [
		THREE.ShaderChunk["map_pars_vertex"],
		'// varying float vFresnel;',
		'varying vec3 vTransformedNormal;',
		'varying vec4 vPosition;',
		'void main() {',
			THREE.ShaderChunk["map_vertex"],
			THREE.ShaderChunk["default_vertex"],
			THREE.ShaderChunk[ "defaultnormal_vertex" ],
		'	vPosition = mvPosition;',
		'	vTransformedNormal = transformedNormal;',
			THREE.ShaderChunk["worldpos_vertex"],
		'}'].join("\n"),
	fragmentShader: [
		'uniform float opacity;',
		THREE.ShaderChunk["map_pars_fragment"],
		'uniform float color_opacity;',
		'uniform float fresnelIntensity;',
		'uniform vec3 fresnelColor;',
		'uniform vec3 diffuse;',
		'// varying float vFresnel;',
		'varying vec3 vTransformedNormal;',
		'varying vec4 vPosition;',
		'void main() {',
		'	vec3 white = vec3( 1.0 );',
		'	// start with the "mouseover" color',
		'	// make it disappear along with opacity',
		'	gl_FragColor = vec4( mix(  white, diffuse , color_opacity * opacity )  , opacity );',
		'	// multiply texture over "mouseover" color',
		'	gl_FragColor.xyz *= texture2D( map, vUv ).xyz;',
		'	// fresnel reflection',
		'	float flipNormal = -1.0 + ( 2.0 * float( gl_FrontFacing ) );',
		'	vec3 transformedNormal = vTransformedNormal * flipNormal;',
		'	float fresnelPow = 5.0 ;',
		'	float f = 1.0 + dot( normalize( vPosition.xyz ) , normalize( transformedNormal.xyz ) ) ;',
		'	float fresnel = clamp( pow( abs( f ) , fresnelPow ) , 0.0, 1.0 ) ;',
		'	float fresnelFactor = fresnel * fresnelIntensity;',
		'	// gl_FragColor.xyz = mix( gl_FragColor.xyz, white, fresnel );',
		'	gl_FragColor.xyz = mix( gl_FragColor.xyz, vec3(0.9,0.9,0.9), fresnelFactor );',
		'	// gl_FragColor.w *= ( 1.0 - fresnel );',
		'	// #THREE.ShaderChunk["alphatest_fragment"]',
			THREE.ShaderChunk["linear_to_gamma_fragment"],
		'	// #THREE.ShaderChunk["fog_fragment"]',
		'}'].join("\n")
};
