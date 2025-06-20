"use strict";
/**
 * Enhanced O3 Manager with Better Context Awareness
 * Provides intelligent website analysis with relevant file context
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.o3Manager = exports.EnhancedO3Manager = void 0;
var fs = require("fs");
var path = require("path");
// Define file extensions to include in context
var RELEVANT_EXTENSIONS = ['.tsx', '.ts', '.js', '.json', '.md', '.txt'];
// Define directories to exclude (save memory)
var EXCLUDED_DIRS = [
    '.next',
    'node_modules',
    '.git',
    'temp_images',
    'public/images',
    'archive',
    'backup-scripts',
    'seo-reports'
];
// Define file patterns to include for SEO analysis
var SEO_RELEVANT_PATTERNS = [
    'layout.tsx',
    'page.tsx',
    'metadata.ts',
    'robots.txt',
    'sitemap',
    'structured-data',
    'breadcrumb',
    'seo'
];
var EnhancedO3Manager = /** @class */ (function () {
    function EnhancedO3Manager(projectRoot) {
        if (projectRoot === void 0) { projectRoot = process.cwd(); }
        this.context = null;
        this.projectRoot = projectRoot;
    }
    EnhancedO3Manager.prototype.isRelevantFile = function (filePath) {
        var ext = path.extname(filePath);
        var fileName = path.basename(filePath);
        var relativePath = path.relative(this.projectRoot, filePath);
        // Include if extension is relevant
        if (!RELEVANT_EXTENSIONS.includes(ext))
            return false;
        // Exclude if in excluded directory
        if (EXCLUDED_DIRS.some(function (dir) { return relativePath.startsWith(dir); }))
            return false;
        // Include if matches SEO patterns
        if (SEO_RELEVANT_PATTERNS.some(function (pattern) {
            return fileName.includes(pattern) || relativePath.includes(pattern);
        }))
            return true;
        // Include core app files
        if (relativePath.startsWith('app/') && ext === '.tsx')
            return true;
        if (relativePath.startsWith('components/') && ext === '.tsx')
            return true;
        if (relativePath.startsWith('utils/') && ext === '.ts')
            return true;
        return false;
    };
    EnhancedO3Manager.prototype.scanDirectory = function (dir) {
        return __awaiter(this, void 0, void 0, function () {
            var files, entries, _i, entries_1, entry, fullPath, subFiles, stats, content, error_1, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        files = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 13, , 14]);
                        return [4 /*yield*/, fs.promises.readdir(dir, { withFileTypes: true })];
                    case 2:
                        entries = _a.sent();
                        _i = 0, entries_1 = entries;
                        _a.label = 3;
                    case 3:
                        if (!(_i < entries_1.length)) return [3 /*break*/, 12];
                        entry = entries_1[_i];
                        fullPath = path.join(dir, entry.name);
                        if (!entry.isDirectory()) return [3 /*break*/, 6];
                        if (!!EXCLUDED_DIRS.includes(entry.name)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.scanDirectory(fullPath)];
                    case 4:
                        subFiles = _a.sent();
                        files.push.apply(files, subFiles);
                        _a.label = 5;
                    case 5: return [3 /*break*/, 11];
                    case 6:
                        if (!this.isRelevantFile(fullPath)) return [3 /*break*/, 11];
                        _a.label = 7;
                    case 7:
                        _a.trys.push([7, 10, , 11]);
                        return [4 /*yield*/, fs.promises.stat(fullPath)];
                    case 8:
                        stats = _a.sent();
                        return [4 /*yield*/, fs.promises.readFile(fullPath, 'utf-8')];
                    case 9:
                        content = _a.sent();
                        // Limit file size to prevent memory issues
                        if (stats.size < 100000) { // 100KB limit
                            files.push({
                                path: path.relative(this.projectRoot, fullPath),
                                content: content,
                                size: stats.size,
                                lastModified: stats.mtime
                            });
                        }
                        return [3 /*break*/, 11];
                    case 10:
                        error_1 = _a.sent();
                        console.warn("Failed to read file ".concat(fullPath, ":"), error_1);
                        return [3 /*break*/, 11];
                    case 11:
                        _i++;
                        return [3 /*break*/, 3];
                    case 12: return [3 /*break*/, 14];
                    case 13:
                        error_2 = _a.sent();
                        console.warn("Failed to scan directory ".concat(dir, ":"), error_2);
                        return [3 /*break*/, 14];
                    case 14: return [2 /*return*/, files];
                }
            });
        });
    };
    EnhancedO3Manager.prototype.categorizeFiles = function (files) {
        var seoFiles = [];
        var componentFiles = [];
        var configFiles = [];
        var contentFiles = [];
        var seoImplemented = new Set();
        var structuredDataTypes = new Set();
        var metaTags = new Set();
        var pages = new Set();
        var totalSize = 0;
        for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
            var file = files_1[_i];
            totalSize += file.size;
            // Categorize files
            if (file.path.includes('seo') ||
                file.path.includes('structured-data') ||
                file.path.includes('breadcrumb') ||
                file.path.includes('robots.txt') ||
                file.path.includes('sitemap')) {
                seoFiles.push(file);
            }
            else if (file.path.startsWith('components/')) {
                componentFiles.push(file);
            }
            else if (file.path.includes('config') ||
                file.path.includes('package.json') ||
                file.path.includes('vercel.json')) {
                configFiles.push(file);
            }
            else {
                contentFiles.push(file);
            }
            // Analyze content for SEO features
            var content = file.content.toLowerCase();
            // Detect SEO implementations
            if (content.includes('metadata'))
                seoImplemented.add('Meta Tags');
            if (content.includes('opengraph'))
                seoImplemented.add('Open Graph');
            if (content.includes('twitter'))
                seoImplemented.add('Twitter Cards');
            if (content.includes('application/ld+json'))
                seoImplemented.add('Structured Data');
            if (content.includes('breadcrumb'))
                seoImplemented.add('Breadcrumbs');
            if (content.includes('sitemap'))
                seoImplemented.add('Sitemap');
            if (content.includes('robots'))
                seoImplemented.add('Robots.txt');
            // Detect structured data types
            if (content.includes('"@type": "organization"'))
                structuredDataTypes.add('Organization');
            if (content.includes('"@type": "website"'))
                structuredDataTypes.add('Website');
            if (content.includes('"@type": "article"'))
                structuredDataTypes.add('Article');
            if (content.includes('"@type": "service"'))
                structuredDataTypes.add('Service');
            if (content.includes('"@type": "faqpage"'))
                structuredDataTypes.add('FAQ');
            if (content.includes('"@type": "breadcrumblist"'))
                structuredDataTypes.add('Breadcrumb');
            // Detect meta tags
            if (content.includes('title:'))
                metaTags.add('Title');
            if (content.includes('description:'))
                metaTags.add('Description');
            if (content.includes('keywords:'))
                metaTags.add('Keywords');
            if (content.includes('canonical:'))
                metaTags.add('Canonical');
            // Detect pages
            if (file.path.includes('page.tsx')) {
                var pagePath = file.path.replace('/page.tsx', '') || 'homepage';
                pages.add(pagePath);
            }
        }
        return {
            seoFiles: seoFiles,
            componentFiles: componentFiles,
            configFiles: configFiles,
            contentFiles: contentFiles,
            summary: {
                totalFiles: files.length,
                totalSize: totalSize,
                seoImplemented: Array.from(seoImplemented),
                structuredDataTypes: Array.from(structuredDataTypes),
                metaTags: Array.from(metaTags),
                pages: Array.from(pages)
            }
        };
    };
    EnhancedO3Manager.prototype.buildContext = function () {
        return __awaiter(this, void 0, void 0, function () {
            var startTime, files, endTime;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.context)
                            return [2 /*return*/, this.context];
                        console.log('🔍 Building website context for O3 analysis...');
                        startTime = Date.now();
                        return [4 /*yield*/, this.scanDirectory(this.projectRoot)];
                    case 1:
                        files = _a.sent();
                        this.context = this.categorizeFiles(files);
                        endTime = Date.now();
                        console.log("\u2705 Context built: ".concat(this.context.summary.totalFiles, " files (").concat(Math.round(this.context.summary.totalSize / 1024), "KB) in ").concat(endTime - startTime, "ms"));
                        return [2 /*return*/, this.context];
                }
            });
        });
    };
    EnhancedO3Manager.prototype.getSEOAnalysisContext = function () {
        return __awaiter(this, void 0, void 0, function () {
            var context;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.buildContext()];
                    case 1:
                        context = _a.sent();
                        return [2 /*return*/, "\n# Website SEO Context Analysis\n\n## Current SEO Implementation Status\n".concat(context.summary.seoImplemented.map(function (item) { return "\u2705 ".concat(item); }).join('\n'), "\n\n## Structured Data Types Found\n").concat(context.summary.structuredDataTypes.map(function (type) { return "\u2705 ".concat(type, " Schema"); }).join('\n'), "\n\n## Meta Tags Implemented\n").concat(context.summary.metaTags.map(function (tag) { return "\u2705 ".concat(tag); }).join('\n'), "\n\n## Pages Analyzed\n").concat(context.summary.pages.map(function (page) { return "\u2022 ".concat(page); }).join('\n'), "\n\n## Key SEO Files\n").concat(context.seoFiles.map(function (file) { return "\u2022 ".concat(file.path, " (").concat(Math.round(file.size / 1024), "KB)"); }).join('\n'), "\n\n## File Analysis Summary\n- **Total Files**: ").concat(context.summary.totalFiles, "\n- **Total Size**: ").concat(Math.round(context.summary.totalSize / 1024), "KB\n- **SEO Files**: ").concat(context.seoFiles.length, "\n- **Component Files**: ").concat(context.componentFiles.length, "\n- **Content Files**: ").concat(context.contentFiles.length, "\n\n## Memory Optimization\n- Excluded directories: ").concat(EXCLUDED_DIRS.join(', '), "\n- File size limit: 100KB per file\n- Relevant extensions only: ").concat(RELEVANT_EXTENSIONS.join(', '), "\n\nThis context provides comprehensive SEO analysis data while maintaining memory efficiency.\n    ").trim()];
                }
            });
        });
    };
    EnhancedO3Manager.prototype.getFileContent = function (relativePath) {
        return __awaiter(this, void 0, void 0, function () {
            var context, file;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.buildContext()];
                    case 1:
                        context = _a.sent();
                        file = __spreadArray(__spreadArray(__spreadArray([], context.seoFiles, true), context.componentFiles, true), context.contentFiles, true).find(function (f) { return f.path === relativePath; });
                        return [2 /*return*/, file ? file.content : null];
                }
            });
        });
    };
    EnhancedO3Manager.prototype.getContextSummary = function () {
        if (!this.context)
            return null;
        return "\nWebsite Context Summary:\n- ".concat(this.context.summary.totalFiles, " relevant files loaded\n- ").concat(Math.round(this.context.summary.totalSize / 1024), "KB total size\n- SEO Features: ").concat(this.context.summary.seoImplemented.join(', '), "\n- Structured Data: ").concat(this.context.summary.structuredDataTypes.join(', '), "\n- Pages: ").concat(this.context.summary.pages.length, " pages found\n    ").trim();
    };
    return EnhancedO3Manager;
}());
exports.EnhancedO3Manager = EnhancedO3Manager;
// Export singleton instance
exports.o3Manager = new EnhancedO3Manager();
