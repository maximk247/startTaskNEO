import { TestBed } from "@angular/core/testing";
import { DrawService } from "./draw.service";
import { CoordinateSystemService } from "src/app/modules/shared/shared-components/coordinate-system-selector/coordintate-system.service";
import { Subject } from "rxjs";
import { Interaction } from "ol/interaction";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Map from "ol/Map";
import { Feature } from "ol";
import { Point, LineString, Polygon } from "ol/geom";
import {
	Style,
	Fill,
	Stroke,
	Text,
	RegularShape,
	Circle as CircleStyle,
} from "ol/style";
import {
	Tools,
	ColorType,
	FillStyles,
	StrokeStyles,
	PointStyles,
} from "./enum/draw.enum";
import { CustomDraw } from "src/app/modules/shared/classes/draw-interaction.class";

describe("DrawService", () => {
	let service: DrawService;
	let mockCoordinateSystemService: jasmine.SpyObj<CoordinateSystemService>;

	beforeEach(() => {
		const spy = jasmine.createSpyObj("CoordinateSystemService", [
			"transformCoordinates",
		]);

		TestBed.configureTestingModule({
			providers: [
				DrawService,
				{ provide: CoordinateSystemService, useValue: spy },
			],
		});

		service = TestBed.inject(DrawService);
		mockCoordinateSystemService = TestBed.inject(
			CoordinateSystemService,
		) as jasmine.SpyObj<CoordinateSystemService>;

		mockCoordinateSystemService.transformCoordinates.and.returnValue([
			100, 200,
		]);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});

	it("should initialize with default values", () => {
		expect(service.getShowCoordinates()).toBeFalse();
		expect(service.getSize(Tools.Point)).toBe(10);
		expect(service.getSize(Tools.Line)).toBe(2);
		expect(service.getSize(Tools.Polygon)).toBe(10);
	});

	it("should toggle show coordinates", () => {
		service.setShowCoordinates(true);
		expect(service.getShowCoordinates()).toBeTrue();
	});

	it("should reset draw features", () => {
		service.setSize(20, Tools.Point);
		service.resetDrawFeatures();
		expect(service.getSize(Tools.Point)).toBe(10);
	});

	it("should set and get color for a tool", () => {
		service.setColor("rgba(255, 255, 255, 1)", Tools.Point);
		expect(service.getColor(Tools.Point)).toBe("rgba(255, 255, 255, 1)");
	});

	it("should add and remove global interaction", () => {
		const map = new Map();
		const interaction = new Interaction({ handleEvent: () => true });
		service.addGlobalInteraction(map, interaction);
		expect(map.getInteractions().getArray()).toContain(interaction);

		service.removeGlobalInteraction(map, interaction);
		expect(map.getInteractions().getArray()).not.toContain(interaction);
	});

	it("should add and remove text from a feature", () => {
		const feature = new Feature({ geometry: new Point([0, 0]) });
		service.addText(feature, Tools.Point);

		const style = feature.getStyle() as Style;
		const textStyle = style.getText() as Text;
		expect(textStyle.getText()).toBe("(100\n 200)");

		service.removeText(feature);
		const updatedStyle = feature.getStyle() as Style;
		const updatedTextStyle = updatedStyle.getText() as Text;
		expect(updatedTextStyle.getText()).toBe("");
	});

	it("should set and get stroke style for a tool", () => {
		service.setStrokeStyle(Tools.Line, "Dashed");
		expect((service as any).getToolOptions(Tools.Line)?.strokeStyle).toBe(
			"Dashed",
		);
	});

	it("should split RGBA colors", () => {
		const colors = service.splitRgbaColors(
			"rgba(255, 0, 0, 1)rgba(0, 0, 255, 1)",
		);
		expect(colors.fillColor).toBe("rgba(255, 0, 0, 1)");
		expect(colors.strokeColor).toBe("rgba(0, 0, 255, 1)");
	});

	it("should set and get alpha for a tool", () => {
		service.setColor("rgba(255, 255, 255, 0.5)", Tools.Point);
		expect(service.getAlpha(Tools.Point)).toBe(0.5);
	});

	it("should set and get fill styles", async () => {
		await service.setFill(Tools.Polygon, FillStyles.DiagonalCrossHatching);
		const fillStyle = await service.getFill(Tools.Polygon);
		expect(fillStyle).toBeTruthy();
	});

	it("should set and get point shape", () => {
		service.setPointShape(PointStyles.Square);
		expect(service.getPointShape()).toBe(PointStyles.Square);
	});

	it("should get style for different tools", async () => {
		const pointStyle = await service.getStyle(Tools.Point);
		expect(pointStyle).toBeInstanceOf(Style);

		const lineStyle = await service.getStyle(Tools.Line);
		expect(lineStyle).toBeInstanceOf(Style);

		const polygonStyle = await service.getStyle(Tools.Polygon);
		expect(polygonStyle).toBeInstanceOf(Style);
	});

	it("should initialize layer and source", () => {
		service.initializeLayer();
		expect(service.getVectorLayer()).toBeInstanceOf(VectorLayer);
		expect(service.getVectorSource()).toBeInstanceOf(VectorSource);
	});

	it("should set tool pattern for different tools", async () => {
		service["setToolPattern"](Tools.Polygon, "test-pattern");
		expect(service["polygon"].pattern).toBe("test-pattern");

		service["setToolPattern"](Tools.FreePolygon, "test-pattern");
		expect(service["freePolygon"].pattern).toBe("test-pattern");

		service["setToolPattern"](Tools.Figure, "test-pattern");
		expect(service["figure"].pattern).toBe("test-pattern");
	});

	it("should set image for point", () => {
		const options: any = {};
		service["setImageForPoint"](
			options,
			true,
			"rgba(255, 255, 255, 1)",
			2,
			4,
			Math.PI / 4,
			10,
		);
		expect(options.image).toBeDefined();
	});

	it("should set stroke helper", () => {
		const options: any = {};
		service["setStrokeHelper"](options, "rgba(255, 255, 255, 1)", 2, [16, 8]);
		expect(options.stroke).toBeDefined();
	});

	it("should set fill style", () => {
		const options: any = {};
		service["setFillStyle"](options, "rgba(255, 255, 255, 1)", Tools.Polygon);
		expect(options.fill).toBeDefined();
	});

	it("should set point style", () => {
		const options: any = {};
		service["setPointStyle"](options, 10, "rgba(255, 255, 255, 1)");
		expect(options.image).toBeDefined();
	});

	it("should set line style", () => {
		const options: any = {};
		service["setLineStyle"](options, 2, "rgba(255, 255, 255, 1)", {
			strokeStyle: StrokeStyles.Dashed,
			size: 0,
			color: "",
			dash: undefined,
		});
		expect(options.stroke).toBeDefined();
	});

	it("should initialize drawing tools", () => {
		const map = new Map();
		spyOn(map, "addInteraction");
		spyOn(map, "addLayer");
		spyOn(service, "initializeDraw").and.callFake(
			(map, vector, source, type, freehand = false, geometryFunction) => {
				return new Interaction({
					handleEvent: () => true,
				}) as any;
			},
		);

		const pointDraw = service.initializePoint(map);
		expect(pointDraw).toBeInstanceOf(Interaction);
	});

	it("should set and get fill color for a tool", () => {
		service.setColor("rgba(255, 0, 0, 1)", Tools.Polygon, ColorType.Fill);
		expect(service.getColor(Tools.Polygon, ColorType.Fill)).toBe(
			"rgba(255, 0, 0, 1)",
		);
	});

	it("should set and get stroke color for a tool", () => {
		service.setColor("rgba(0, 0, 255, 1)", Tools.Polygon, ColorType.Stroke);
		expect(service.getColor(Tools.Polygon, ColorType.Stroke)).toBe(
			"rgba(0, 0, 255, 1)",
		);
	});

	it("should handle stylePatternSimplePoly with valid pattern", async () => {
		const pattern = "reverseDiagonal.png";
		const fillColor = "rgba(255, 255, 255, 1)";
		const tool = Tools.Polygon;

		const patternResult = await service["stylePatternSimplePoly"](
			pattern,
			fillColor,
			tool,
		);
		expect(patternResult).not.toBeNull();
	});

	it("should handle stylePatternSimplePoly with invalid pattern", async () => {
		const pattern = "invalid-pattern.png";
		const fillColor = "rgba(255, 255, 255, 1)";
		const tool = Tools.Polygon;

		const patternResult = await service["stylePatternSimplePoly"](
			pattern,
			fillColor,
			tool,
		);
		expect(patternResult).toBeNull();
	});

	it("should handle invalid getToolOptions cases", () => {
		const invalidTool = "InvalidTool" as Tools;
		const toolOptions = service["getToolOptions"](invalidTool);
		expect(toolOptions).toBeUndefined();
	});

	it("should set polygon color with long rgba string", () => {
		const color = "rgba(255, 0, 0, 1)rgba(0, 0, 255, 1)";
		service.setColor(color, Tools.Polygon);
		expect(service.getColor(Tools.Polygon)).toBe(color);
	});

	it("should set fill style to none", async () => {
		await service.setFill(Tools.Polygon, FillStyles.Solid);
		const fillStyle = await service.getFill(Tools.Polygon);
		expect(fillStyle).toBeNull();
	});

	it("should handle setFillHelper with empty pattern", async () => {
		const toolOptions = service["createDefaultPolygon"]();
		await service["setFillHelper"](toolOptions, "", Tools.Polygon);
		expect(toolOptions.fillStyle).toBeNull();
	});

	it("should handle setImageForPoint with circle shape", () => {
		const options: any = {};
		service["setImageForPoint"](
			options,
			true,
			"rgba(255, 255, 255, 1)",
			2,
			0,
			0,
			10,
			undefined,
			true,
		);
		expect(options.image).toBeInstanceOf(CircleStyle);
	});

	it("should handle setPointStyle for different shapes", () => {
		const options: any = {};
		service.setPointShape(PointStyles.Cross);
		service["setPointStyle"](options, 10, "rgba(255, 255, 255, 1)");
		expect(options.image).toBeInstanceOf(RegularShape);

		service.setPointShape(PointStyles.Diamond);
		service["setPointStyle"](options, 10, "rgba(255, 255, 255, 1)");
		expect(options.image).toBeInstanceOf(RegularShape);

		service.setPointShape(PointStyles.Cancel);
		service["setPointStyle"](options, 10, "rgba(255, 255, 255, 1)");
		expect(options.image).toBeInstanceOf(RegularShape);

		service.setPointShape(PointStyles.Square);
		service["setPointStyle"](options, 10, "rgba(255, 255, 255, 1)");
		expect(options.image).toBeInstanceOf(RegularShape);

		service.setPointShape(PointStyles.Circle);
		service["setPointStyle"](options, 10, "rgba(255, 255, 255, 1)");
		expect(options.image).toBeInstanceOf(CircleStyle);
	});

	it("should handle addText with missing style", () => {
		const feature = new Feature({ geometry: new Point([0, 0]) });
		feature.setStyle(undefined);
		service.addText(feature, Tools.Point);
		const style = feature.getStyle() as Style;
		expect(style).toBeDefined();
	});

	it("should handle removeText with missing style", () => {
		const feature = new Feature({ geometry: new Point([0, 0]) });
		feature.setStyle(undefined);
		service.removeText(feature);
		const style = feature.getStyle() as Style;
		expect(style).toBeUndefined();
	});
});
