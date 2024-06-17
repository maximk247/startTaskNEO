interface Elevation {
	latitude: number;
	longitude: number;
	elevation: number;
}

export interface ElevationArray {
	results: Array<Elevation>;
}
