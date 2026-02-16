/**
 * @fileoverview Tests for Glass Physics TypeScript Interface
 */

import {
  GlassPhysics,
  vec3,
  normalizeVec3,
  dotVec3,
  LightDirections,
  SurfaceNormals,
  glassCSS,
  type Vector3,
  type GlassMaterialPreset,
} from '../glass-physics';

describe('Vector3 Utilities', () => {
  describe('vec3', () => {
    it('should create a vector', () => {
      const v = vec3(1, 2, 3);
      expect(v).toEqual({ x: 1, y: 2, z: 3 });
    });
  });

  describe('normalizeVec3', () => {
    it('should normalize a vector to unit length', () => {
      const v = vec3(3, 4, 0);
      const normalized = normalizeVec3(v);

      const length = Math.sqrt(
        normalized.x ** 2 + normalized.y ** 2 + normalized.z ** 2
      );

      expect(length).toBeCloseTo(1.0, 5);
    });

    it('should handle zero vector', () => {
      const v = vec3(0, 0, 0);
      const normalized = normalizeVec3(v);

      expect(normalized).toEqual({ x: 0, y: 0, z: 1 });
    });
  });

  describe('dotVec3', () => {
    it('should calculate dot product', () => {
      const a = vec3(1, 0, 0);
      const b = vec3(0, 1, 0);

      expect(dotVec3(a, b)).toBe(0); // Perpendicular
    });

    it('should calculate dot product for parallel vectors', () => {
      const a = vec3(1, 0, 0);
      const b = vec3(1, 0, 0);

      expect(dotVec3(a, b)).toBe(1); // Parallel
    });
  });
});

describe('Light Directions', () => {
  it('should provide normalized presets', () => {
    const directions = [
      LightDirections.topLeft,
      LightDirections.top,
      LightDirections.topRight,
      LightDirections.front,
      LightDirections.dramatic,
    ];

    directions.forEach((dir) => {
      const length = Math.sqrt(dir.x ** 2 + dir.y ** 2 + dir.z ** 2);
      expect(length).toBeCloseTo(1.0, 5);
    });
  });
});

describe('Surface Normals', () => {
  it('should provide normalized surface normals', () => {
    const normals = [
      SurfaceNormals.flat,
      SurfaceNormals.curvedUp,
      SurfaceNormals.curvedDown,
    ];

    normals.forEach((normal) => {
      const length = Math.sqrt(normal.x ** 2 + normal.y ** 2 + normal.z ** 2);
      expect(length).toBeCloseTo(1.0, 5);
    });
  });

  it('flat surface should face forward', () => {
    expect(SurfaceNormals.flat).toEqual({ x: 0, y: 0, z: 1 });
  });
});

describe('GlassPhysics', () => {
  describe('constructor', () => {
    it('should create engine with default preset', () => {
      const engine = new GlassPhysics();
      expect(engine).toBeDefined();
    });

    it('should create engine with specific preset', () => {
      const presets: GlassMaterialPreset[] = ['clear', 'regular', 'thick', 'frosted'];

      presets.forEach((preset) => {
        const engine = new GlassPhysics(preset);
        expect(engine).toBeDefined();
      });
    });
  });

  describe('calculate', () => {
    it('should calculate properties with defaults', () => {
      const engine = new GlassPhysics('regular');
      const props = engine.calculate();

      expect(props).toBeDefined();
      expect(typeof props.opacity).toBe('number');
      expect(typeof props.blur).toBe('number');
      expect(typeof props.noiseScale).toBe('number');
      expect(typeof props.fresnelValue).toBe('number');
      expect(Array.isArray(props.fresnelGradient)).toBe(true);
      expect(Array.isArray(props.specularLayers)).toBe(true);
    });

    it('should calculate properties with custom config', () => {
      const engine = new GlassPhysics('clear');
      const props = engine.calculate({
        normal: SurfaceNormals.curvedUp,
        lightDirection: LightDirections.topLeft,
        viewDirection: vec3(0, 0, 1),
      });

      expect(props).toBeDefined();
      expect(props.opacity).toBeGreaterThan(0);
      expect(props.opacity).toBeLessThanOrEqual(1);
    });

    it('should have different properties for different presets', () => {
      const clear = new GlassPhysics('clear').calculate();
      const frosted = new GlassPhysics('frosted').calculate();

      // Frosted should be more opaque and blurrier
      expect(frosted.opacity).toBeLessThan(clear.opacity);
      expect(frosted.blur).toBeGreaterThan(clear.blur);
    });
  });

  describe('toCSS', () => {
    it('should generate valid CSS', () => {
      const engine = new GlassPhysics('regular');
      const props = engine.calculate();
      const css = engine.toCSS(props);

      expect(css.filter).toBeDefined();
      expect(css.background).toBeDefined();
      expect(css.backdropFilter).toBeDefined();
      expect(css.boxShadow).toBeDefined();
      expect(css.all).toBeDefined();
      expect(typeof css.all).toBe('object');
    });

    it('should respect CSS options', () => {
      const engine = new GlassPhysics('regular');
      const props = engine.calculate();

      const css1 = engine.toCSS(props, { includeBackground: false });
      const css2 = engine.toCSS(props, { includeBackdrop: false });
      const css3 = engine.toCSS(props, { includeSpecular: false });

      expect(css1.background).not.toContain('gradient');
      expect(css2.backdropFilter).toBe('none');
      expect(css3.boxShadow).toBe('none');
    });

    it('should use custom base color', () => {
      const engine = new GlassPhysics('regular');
      const props = engine.calculate();

      const css = engine.toCSS(props, {
        baseColor: 'rgba(255, 0, 0, 0.2)',
        includeBackground: false,
      });

      expect(css.background).toBe('rgba(255, 0, 0, 0.2)');
    });
  });

  describe('getMaterial', () => {
    it('should return material info', () => {
      const engine = new GlassPhysics('regular');
      const material = engine.getMaterial();

      // May be null if WASM not loaded, but should have consistent type
      if (material) {
        expect(material.preset).toBe('regular');
        expect(typeof material.ior).toBe('number');
        expect(typeof material.roughness).toBe('number');
        expect(typeof material.thickness).toBe('number');
      }
    });
  });
});

describe('glassCSS convenience function', () => {
  it('should generate CSS for preset', async () => {
    const css = await glassCSS('regular');

    expect(css).toBeDefined();
    expect(typeof css.filter).toBe('string');
    expect(typeof css.background).toBe('string');
  });

  it('should accept custom config', async () => {
    const css = await glassCSS('frosted', {
      lightDirection: LightDirections.dramatic,
      normal: SurfaceNormals.curvedDown,
    });

    expect(css).toBeDefined();
  });
});

describe('Fallback behavior', () => {
  it('should provide fallback properties when WASM unavailable', () => {
    const engine = new GlassPhysics('regular');
    // Force fallback by not waiting for WASM
    const props = engine.calculate();

    // Should still return valid properties
    expect(props.opacity).toBeGreaterThan(0);
    expect(props.blur).toBeGreaterThan(0);
    expect(props.fresnelGradient.length).toBeGreaterThan(0);
    expect(props.specularLayers.length).toBeGreaterThan(0);
  });

  it('should have sensible fallback values for each preset', () => {
    const presets: GlassMaterialPreset[] = ['clear', 'regular', 'thick', 'frosted'];
    const engines = presets.map((p) => new GlassPhysics(p));

    const properties = engines.map((e) => e.calculate());

    // Verify ordering: clear > regular > thick > frosted (opacity decreases)
    expect(properties[0].opacity).toBeGreaterThan(properties[1].opacity);
    expect(properties[1].opacity).toBeGreaterThan(properties[2].opacity);
    expect(properties[2].opacity).toBeGreaterThan(properties[3].opacity);

    // Verify ordering: clear < regular < thick < frosted (blur increases)
    expect(properties[0].blur).toBeLessThan(properties[1].blur);
    expect(properties[1].blur).toBeLessThan(properties[2].blur);
    expect(properties[2].blur).toBeLessThan(properties[3].blur);
  });
});

describe('CSS Output Format', () => {
  it('should generate valid CSS filter syntax', () => {
    const engine = new GlassPhysics('regular');
    const props = engine.calculate();
    const css = engine.toCSS(props);

    // Check blur format
    if (css.filter !== 'none') {
      expect(css.filter).toMatch(/^blur\(\d+\.?\d*px\)$/);
    }
  });

  it('should generate valid box-shadow with inset', () => {
    const engine = new GlassPhysics('regular');
    const props = engine.calculate();
    const css = engine.toCSS(props, { includeSpecular: true });

    if (css.boxShadow !== 'none') {
      expect(css.boxShadow).toContain('inset');
      expect(css.boxShadow).toMatch(/rgba\(\d+,\s*\d+,\s*\d+,\s*[\d.]+\)/);
    }
  });

  it('should generate valid gradient syntax', () => {
    const engine = new GlassPhysics('regular');
    const props = engine.calculate();
    const css = engine.toCSS(props, { includeBackground: true });

    if (css.background.includes('gradient')) {
      expect(css.background).toMatch(/linear-gradient\(/);
      expect(css.background).toMatch(/rgba\(\d+,\s*\d+,\s*\d+,\s*[\d.]+\)/);
      expect(css.background).toMatch(/\d+\.?\d*%/);
    }
  });
});
