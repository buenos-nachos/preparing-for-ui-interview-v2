import './reset.css'
import css from './app.module.css'
import { useState, useMemo } from 'react'
import {
  ToastExample,
  ToastVanillaExample,
  ToastStudentExample,
  ToastStudentVanillaExample,
} from './problems/components/10-toast/toast.example'
import './problems/components/10-toast/solution/toast.animations.css' // Global keyframes

import {
  CheckboxTreeExample,
  CheckboxTreeVanillaExample,
  CheckboxesStudentExample,
  CheckboxesStudentVanillaExample,
} from './problems/components/09-nested-checkboxes/checkboxes.example'
import {
  AccordionExample,
  AccordionVanillaExample,
  AccordionStudentExample,
  AccordionStudentVanillaExample,
} from './problems/components/01-accordion/accordion.example'
import {
  TabsExample,
  TabsVanillaExample,
  TabsStudentExample,
  TabsStudentVanillaExample, // Verified export exists
} from './problems/components/03-tabs/tabs.example'
import {
  TooltipExample,
  TooltipVanillaExample,
  TooltipStudentExample,
} from './problems/components/05-tooltip/tooltip.example'
import {
  TableExample,
  TableVanillaExample,
  TableStudentExample,
  TableStudentVanillaExample, // Verified export exists
} from './problems/components/06-table/table.example'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { MarkdownExample, MarkdownStudentExample } from './problems/components/18-markdown/markdown.example'
import {
  ProgressBarExample,
  ProgressBarVanillaExample,
  ProgressBarStudentExample,
  ProgressBarStudentVanillaExample,
} from './problems/components/15-progress-bar/progress-bar.example'
import {
  SquareGameExample,
  SquareGameVanillaExample,
  SquareGameStudentExample,
} from './problems/components/12-square-game/square-game.example'
import { UploadComponentExample, UploadComponentStudentExample } from './problems/components/16-upload-component/upload-component.example'
import {
  InfiniteCanvasExample,
  InfiniteCanvasStudentExample,
  // InfiniteCanvasStudentVanillaExample - Not implemented
} from './problems/components/20-infinite-canvas/infinite-canvas.example'
import {
  GalleryExample,
  GalleryVanillaExample,
  GalleryStudentExample,
  GalleryStudentVanillaExample,
} from './problems/components/08-gallery/gallery.example'
import {
  GPTComponentExample,
  GPTChatVanillaExample,
  GptChatStudentExample,
  GptChatStudentVanillaExample,
} from './problems/components/19-gpt-chat/gpt-chat.example'

import {
  RedditThreadExample,
  RedditThreadVanillaExample,
  RedditThreadStudentExample,
  RedditThreadStudentVanillaExample,
} from './problems/components/07-reddit-thread/reddit-thread.example'
import {
  StarRatingExample,
  StarRatingVanillaExample,
  StarRatingStudentExample,
} from './problems/components/02-star-rating/star-rating.example'
import {
  CalculatorExample,
  CalculatorVanillaExample,
  CalculatorStudentExample,
  CalculatorStudentVanillaExample,
} from './problems/components/11-calculator/calculator.example'
import {
  TypeaheadExample,
  TypeaheadVanillaExample,
  TypeaheadStudentExample,
} from './problems/components/13-typeahead/typeahead.example'
import { DialogExample, DialogVanillaExample, DialogStudentExample } from './problems/components/04-dialog/dialog.example'
import {
  PortfolioVisualizerExample,
  PortfolioVisualizerVanillaExample,
  PortfolioVisualizerStudentExample,
  PortfolioVisualizerStudentVanillaExample,
} from './problems/components/17-portfolio-visualizer/portfolio-visualizer.example'
import {
  GoogleSheetExample,
  GoogleSheetVanillaExample,
  GoogleSheetStudentExample,
  GoogleSheetStudentVanillaExample,
} from './problems/components/21.4-google-sheet-ux/google-sheet.example'
import { ParserExample } from './problems/components/21.1-google-sheet-parser/parser.example'
import { TopoExample } from './problems/components/21.2-google-sheet-topo/topo.example'
import { TableEngineExample } from './problems/components/21.3-google-sheet-engine/table-engine.example'

// Import problem markdown files (Bun text imports)
import toastProblem from './problems/components/10-toast/problem.md' with { type: 'text' }
import checkboxProblem from './problems/components/09-nested-checkboxes/problem.md' with { type: 'text' }
import accordionProblem from './problems/components/01-accordion/problem.md' with { type: 'text' }
import tabsProblem from './problems/components/03-tabs/problem.md' with { type: 'text' }
import tooltipProblem from './problems/components/05-tooltip/problem.md' with { type: 'text' }
import dialogProblem from './problems/components/04-dialog/problem.md' with { type: 'text' }
import tableProblem from './problems/components/06-table/problem.md' with { type: 'text' }
import markdownProblem from './problems/components/18-markdown/problem.md' with { type: 'text' }
import squareGameProblem from './problems/components/12-square-game/problem.md' with { type: 'text' }
import progressBarProblem from './problems/components/15-progress-bar/problem.md' with { type: 'text' }
import uploadComponentProblem from './problems/components/16-upload-component/problem.md' with { type: 'text' }
import portfolioVisualizerProblem from './problems/components/17-portfolio-visualizer/problem.md' with { type: 'text' }
import googleSheetProblem from './problems/components/21.4-google-sheet-ux/problem.md' with { type: 'text' }
import parserProblem from './problems/components/21.1-google-sheet-parser/problem.md' with { type: 'text' }
import topoProblem from './problems/components/21.2-google-sheet-topo/problem.md' with { type: 'text' }
import tableEngineProblem from './problems/components/21.3-google-sheet-engine/problem.md' with { type: 'text' }
import infiniteCanvasProblem from './problems/components/20-infinite-canvas/problem.md' with { type: 'text' }
import galleryProblem from './problems/components/08-gallery/problem.md' with { type: 'text' }
import gptChatProblem from './problems/components/19-gpt-chat/problem.md' with { type: 'text' }

import redditThreadProblem from './problems/components/07-reddit-thread/problem.md' with { type: 'text' }
import starRatingProblem from './problems/components/02-star-rating/problem.md' with { type: 'text' }
import calculatorProblem from './problems/components/11-calculator/problem.md' with { type: 'text' }
import typeaheadProblem from './problems/components/13-typeahead/problem.md' with { type: 'text' }

// Import vanilla JS problem markdown files
import detectTypeProblem from './problems/vanila/01-detect-type/problem.md' with { type: 'text' }
import debounceProblem from './problems/vanila/02-debounce/problem.md' with { type: 'text' }
import throttleProblem from './problems/vanila/03-throttle/problem.md' with { type: 'text' }
import es5ExtendsProblem from './problems/vanila/04-es5-extends/problem.md' with { type: 'text' }
import deepEqualsProblem from './problems/vanila/05-deep-equals/problem.md' with { type: 'text' }
import deepCloneProblem from './problems/vanila/06-deep-clone/problem.md' with { type: 'text' }
import stringifyProblem from './problems/vanila/07-stringify/problem.md' with { type: 'text' }
import promiseProblem from './problems/vanila/08-promise/problem.md' with { type: 'text' }
import treeSelectProblem from './problems/vanila/09-tree-select/problem.md' with { type: 'text' }

// TypeScript Imports
import tsIndex from './problems/typescript/index.md' with { type: 'text' }

// 01 Basics
import tsBasicsIndex from './problems/typescript/01-basics/index.md' with { type: 'text' }
// @ts-expect-error: No default export
import tsTupleLength from './problems/typescript/01-basics/01-tuple-length.ts' with { type: 'text' }
// @ts-expect-error: No default export
import tsFirstOfArray from './problems/typescript/01-basics/02-first-of-array.ts' with { type: 'text' }
// @ts-expect-error: No default export
import tsTupleToUnion from './problems/typescript/01-basics/03-tuple-to-union.ts' with { type: 'text' }

// 02 Mapped Types
import tsMappedIndex from './problems/typescript/02-mapped-types/index.md' with { type: 'text' }
// @ts-expect-error: No default export
import tsPick from './problems/typescript/02-mapped-types/01-pick.ts' with { type: 'text' }
// @ts-expect-error: No default export
import tsReadonly from './problems/typescript/02-mapped-types/02-readonly.ts' with { type: 'text' }
// @ts-expect-error: No default export
import tsMutable from './problems/typescript/02-mapped-types/03-mutable.ts' with { type: 'text' }
// @ts-expect-error: No default export
import tsTupleToObject from './problems/typescript/02-mapped-types/04-tuple-to-object.ts' with { type: 'text' }
// @ts-expect-error: No default export
import tsAppendToObject from './problems/typescript/02-mapped-types/05-append-to-object.ts' with { type: 'text' }
// @ts-expect-error: No default export
import tsMerge from './problems/typescript/02-mapped-types/06-merge.ts' with { type: 'text' }
// @ts-expect-error: No default export
import tsDiff from './problems/typescript/02-mapped-types/07-diff.ts' with { type: 'text' }

// 03 Conditional Types
import tsConditionalIndex from './problems/typescript/03-conditional-types/index.md' with { type: 'text' }
// @ts-expect-error: No default export
import tsIf from './problems/typescript/03-conditional-types/01-if.ts' with { type: 'text' }
// @ts-expect-error: No default export
import tsExclude from './problems/typescript/03-conditional-types/02-exclude.ts' with { type: 'text' }
// @ts-expect-error: No default export
import tsIsNever from './problems/typescript/03-conditional-types/03-is-never.ts' with { type: 'text' }
// @ts-expect-error: No default export
import tsAnyOf from './problems/typescript/03-conditional-types/04-any-of.ts' with { type: 'text' }
// @ts-expect-error: No default export
import tsLookup from './problems/typescript/03-conditional-types/05-lookup.ts' with { type: 'text' }

// 04 Infer
import tsInferIndex from './problems/typescript/04-infer/index.md' with { type: 'text' }
// @ts-expect-error: No default export
import tsReturnType from './problems/typescript/04-infer/01-return-type.ts' with { type: 'text' }
// @ts-expect-error: No default export
import tsParameters from './problems/typescript/04-infer/02-parameters.ts' with { type: 'text' }
// @ts-expect-error: No default export
import tsAwaited from './problems/typescript/04-infer/03-awaited.ts' with { type: 'text' }
// @ts-expect-error: No default export
import tsLast from './problems/typescript/04-infer/04-last.ts' with { type: 'text' }
// @ts-expect-error: No default export
import tsPop from './problems/typescript/04-infer/05-pop.ts' with { type: 'text' }
// @ts-expect-error: No default export
import tsFlatten from './problems/typescript/04-infer/06-flatten.ts' with { type: 'text' }

// 05 Template Literals
import tsTemplateIndex from './problems/typescript/05-template-literals/index.md' with { type: 'text' }
// @ts-expect-error: No default export
import tsCapitalize from './problems/typescript/05-template-literals/01-capitalize.ts' with { type: 'text' }
// @ts-expect-error: No default export
import tsTrimLeft from './problems/typescript/05-template-literals/02-trim-left.ts' with { type: 'text' }
// @ts-expect-error: No default export
import tsTrim from './problems/typescript/05-template-literals/03-trim.ts' with { type: 'text' }
// @ts-expect-error: No default export
import tsReplace from './problems/typescript/05-template-literals/04-replace.ts' with { type: 'text' }
// @ts-expect-error: No default export
import tsKebabCase from './problems/typescript/05-template-literals/05-kebab-case.ts' with { type: 'text' }
// @ts-expect-error: No default export
import tsStringToUnion from './problems/typescript/05-template-literals/06-string-to-union.ts' with { type: 'text' }
// @ts-expect-error: No default export
import tsLength from './problems/typescript/05-template-literals/07-length-of-string.ts' with { type: 'text' }
// @ts-expect-error: No default export
import tsStartsEnds from './problems/typescript/05-template-literals/08-starts-ends-with.ts' with { type: 'text' }

// 06 Recursive Types
import tsRecursiveIndex from './problems/typescript/06-recursive-types/index.md' with { type: 'text' }
// @ts-expect-error: No default export
import tsDeepReadonly from './problems/typescript/06-recursive-types/01-deep-readonly.ts' with { type: 'text' }
// @ts-expect-error: No default export
import tsReplaceAll from './problems/typescript/06-recursive-types/02-replace-all.ts' with { type: 'text' }
// @ts-expect-error: No default export
import tsReverse from './problems/typescript/06-recursive-types/03-reverse.ts' with { type: 'text' }
// @ts-expect-error: No default export
import tsFlattenDepth from './problems/typescript/06-recursive-types/04-flatten-depth.ts' with { type: 'text' }
// @ts-expect-error: No default export
import tsFibonacci from './problems/typescript/06-recursive-types/05-fibonacci.ts' with { type: 'text' }

// 07 Distributive Conditionals
import tsDistributiveIndex from './problems/typescript/07-distributive-conditionals/index.md' with { type: 'text' }
// @ts-expect-error: No default export
import tsIsUnion from './problems/typescript/07-distributive-conditionals/01-is-union.ts' with { type: 'text' }
// @ts-expect-error: No default export
import tsPermutation from './problems/typescript/07-distributive-conditionals/02-permutation.ts' with { type: 'text' }

// 08 Advanced Patterns
import tsAdvancedIndex from './problems/typescript/08-advanced-patterns/index.md' with { type: 'text' }
// @ts-expect-error: No default export
import tsPickByType from './problems/typescript/08-advanced-patterns/01-pick-by-type.ts' with { type: 'text' }
// @ts-expect-error: No default export
import tsOmitByType from './problems/typescript/08-advanced-patterns/02-omit-by-type.ts' with { type: 'text' }
// @ts-expect-error: No default export
import tsPartialByKeys from './problems/typescript/08-advanced-patterns/03-partial-by-keys.ts' with { type: 'text' }
// @ts-expect-error: No default export
import tsChunk from './problems/typescript/08-advanced-patterns/04-chunk.ts' with { type: 'text' }

// 09 Expert Techniques
import tsExpertIndex from './problems/typescript/09-expert-techniques/index.md' with { type: 'text' }
// @ts-expect-error: No default export
import tsUnionToIntersection from './problems/typescript/09-expert-techniques/01-union-to-intersection.ts' with { type: 'text' }
// @ts-expect-error: No default export
import tsIsAny from './problems/typescript/09-expert-techniques/02-is-any.ts' with { type: 'text' }
// @ts-expect-error: No default export
import tsGreaterThan from './problems/typescript/09-expert-techniques/03-greater-than.ts' with { type: 'text' }
// @ts-expect-error: No default export
import tsTranspose from './problems/typescript/09-expert-techniques/04-transpose.ts' with { type: 'text' }

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

// Custom code component for ReactMarkdown with syntax highlighting
const CodeBlock = ({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) => {
  const match = /language-(\w+)/.exec(className || '')
  const code = String(children).replace(/\n$/, '')

  if (match) {
    return (
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={match[1]}
        PreTag="div"
        customStyle={{ borderRadius: '8px', fontSize: '0.9rem' }}
      >
        {code}
      </SyntaxHighlighter>
    )
  }

  return (
    <code className={className} {...props}>
      {children}
    </code>
  )
}

// Helper to create a problem overview component
const createProblemOverview = (markdownContent: string) => {
  return () => (
    <div className={css.markdownContent} style={{ padding: '20px' }}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ code: CodeBlock }}>
        {markdownContent}
      </ReactMarkdown>
    </div>
  )
}

const createTsCode = (code: string) => `\`\`\`typescript\n${code}\n\`\`\``

type TDifficulty = 'warm-up' | 'easy' | 'medium' | 'hard' | 'extreme'
type TVariantType = 'overview' | 'react' | 'vanilla' | 'studentReact' | 'studentVanilla' | 'example'

type TVariant = {
  component: React.ComponentType
}

type TProblem = {
  id: string
  name: string
  difficulty: TDifficulty
  variants: Partial<Record<TVariantType, TVariant>>
}

const SECTIONS = {
  javascriptProblems: {
    title: 'Javascript Problems',
    items: {
      detectType: {
        id: 'detectType',
        name: 'Detect Type',
        difficulty: 'easy',
        variants: {
          overview: { component: createProblemOverview(detectTypeProblem) },
        },
      },
      debounce: {
        id: 'debounce',
        name: 'Debounce',
        difficulty: 'easy',
        variants: {
          overview: { component: createProblemOverview(debounceProblem) },
        },
      },
      throttle: {
        id: 'throttle',
        name: 'Throttle',
        difficulty: 'easy',
        variants: {
          overview: { component: createProblemOverview(throttleProblem) },
        },
      },
      es5Extends: {
        id: 'es5Extends',
        name: 'ES5 Extends',
        difficulty: 'medium',
        variants: {
          overview: { component: createProblemOverview(es5ExtendsProblem) },
        },
      },
      deepEquals: {
        id: 'deepEquals',
        name: 'Deep Equals',
        difficulty: 'medium',
        variants: {
          overview: { component: createProblemOverview(deepEqualsProblem) },
        },
      },
      deepClone: {
        id: 'deepClone',
        name: 'Deep Clone',
        difficulty: 'medium',
        variants: {
          overview: { component: createProblemOverview(deepCloneProblem) },
        },
      },
      stringify: {
        id: 'stringify',
        name: 'Stringify',
        difficulty: 'medium',
        variants: {
          overview: { component: createProblemOverview(stringifyProblem) },
        },
      },
      promise: {
        id: 'promise',
        name: 'Promise',
        difficulty: 'hard',
        variants: {
          overview: { component: createProblemOverview(promiseProblem) },
        },
      },
      treeSelect: {
        id: 'treeSelect',
        name: 'Tree Select',
        difficulty: 'medium',
        variants: {
          overview: { component: createProblemOverview(treeSelectProblem) },
        },
      },
    } as Record<string, TProblem>,
  },
  components: {
    title: 'Components',
    items: {
      accordion: {
        id: 'accordion',
        name: 'Accordion',
        difficulty: 'easy',
        variants: {
          overview: { component: createProblemOverview(accordionProblem) },
          react: { component: AccordionExample },
          vanilla: { component: AccordionVanillaExample },
          studentReact: { component: AccordionStudentExample },
          studentVanilla: { component: AccordionStudentVanillaExample },
        },
      },
      starRating: {
        id: 'starRating',
        name: 'Star Rating',
        difficulty: 'easy',
        variants: {
          overview: { component: createProblemOverview(starRatingProblem) },
          react: { component: StarRatingExample },
          vanilla: { component: StarRatingVanillaExample },
          studentReact: { component: StarRatingStudentExample },
        },
      },
      tabs: {
        id: 'tabs',
        name: 'Tabs',
        difficulty: 'easy',
        variants: {
          overview: { component: createProblemOverview(tabsProblem) },
          react: { component: TabsExample },
          vanilla: { component: TabsVanillaExample },
          studentReact: { component: TabsStudentExample },
          studentVanilla: { component: TabsStudentVanillaExample },
        },
      },
      tooltip: {
        id: 'tooltip',
        name: 'Tooltip',
        difficulty: 'easy',
        variants: {
          overview: { component: createProblemOverview(tooltipProblem) },
          react: { component: TooltipExample },
          vanilla: { component: TooltipVanillaExample },
          studentReact: { component: TooltipStudentExample },
        },
      },
      dialog: {
        id: 'dialog',
        name: 'Dialog',
        difficulty: 'easy',
        variants: {
          overview: { component: createProblemOverview(dialogProblem) },
          react: { component: DialogExample },
          vanilla: { component: DialogVanillaExample },
          studentReact: { component: DialogStudentExample },
        },
      },
      table: {
        id: 'table',
        name: 'Table',
        difficulty: 'medium',
        variants: {
          overview: { component: createProblemOverview(tableProblem) },
          react: { component: TableExample },
          vanilla: { component: TableVanillaExample },
          studentReact: { component: TableStudentExample },
          studentVanilla: { component: TableStudentVanillaExample },
        },
      },
      redditThread: {
        id: 'redditThread',
        name: 'Reddit Thread',
        difficulty: 'medium',
        variants: {
          overview: { component: createProblemOverview(redditThreadProblem) },
          react: { component: RedditThreadExample },
          vanilla: { component: RedditThreadVanillaExample },
          studentReact: { component: RedditThreadStudentExample },
          studentVanilla: { component: RedditThreadStudentVanillaExample },
        },
      },
      gallery: {
        id: 'gallery',
        name: 'Gallery',
        difficulty: 'medium',
        variants: {
          overview: { component: createProblemOverview(galleryProblem) },
          react: { component: GalleryExample },
          vanilla: { component: GalleryVanillaExample },
          studentReact: { component: GalleryStudentExample },
          studentVanilla: { component: GalleryStudentVanillaExample },
        },
      },
      checkbox: {
        id: 'checkbox',
        name: 'Checkbox',
        difficulty: 'hard',
        variants: {
          overview: { component: createProblemOverview(checkboxProblem) },
          react: { component: CheckboxTreeExample },
          vanilla: { component: CheckboxTreeVanillaExample },
          studentReact: { component: CheckboxesStudentExample },
          studentVanilla: { component: CheckboxesStudentVanillaExample },
        },
      },
      toast: {
        id: 'toast',
        name: 'Toast',
        difficulty: 'hard',
        variants: {
          overview: { component: createProblemOverview(toastProblem) },
          react: { component: ToastExample },
          vanilla: { component: ToastVanillaExample },
          studentReact: { component: ToastStudentExample },
          studentVanilla: { component: ToastStudentVanillaExample },
        },
      },
      calculator: {
        id: 'calculator',
        name: 'Calculator',
        difficulty: 'hard',
        variants: {
          overview: { component: createProblemOverview(calculatorProblem) },
          react: { component: CalculatorExample },
          vanilla: { component: CalculatorVanillaExample },
          studentReact: { component: CalculatorStudentExample },
          studentVanilla: { component: CalculatorStudentVanillaExample },
        },
      },
      squareGame: {
        id: 'squareGame',
        name: 'Square Game',
        difficulty: 'hard',
        variants: {
          overview: { component: createProblemOverview(squareGameProblem) },
          react: { component: SquareGameExample },
          vanilla: { component: SquareGameVanillaExample },
          studentReact: { component: SquareGameStudentExample },
        },
      },
      typeahead: {
        id: 'typeahead',
        name: 'Typeahead',
        difficulty: 'hard',
        variants: {
          overview: { component: createProblemOverview(typeaheadProblem) },
          react: { component: TypeaheadExample },
          vanilla: { component: TypeaheadVanillaExample },
          studentReact: { component: TypeaheadStudentExample },
        },
      },

      progressBar: {
        id: 'progressBar',
        name: 'Progress Bar',
        difficulty: 'hard',
        variants: {
          overview: { component: createProblemOverview(progressBarProblem) },
          react: { component: ProgressBarExample },
          vanilla: { component: ProgressBarVanillaExample },
          studentReact: { component: ProgressBarStudentExample },
          studentVanilla: { component: ProgressBarStudentVanillaExample },
        },
      },
      uploadComponent: {
        id: 'uploadComponent',
        name: 'Upload Component',
        difficulty: 'hard',
        variants: {
          overview: { component: createProblemOverview(uploadComponentProblem) },
          react: { component: UploadComponentExample },
          studentReact: { component: UploadComponentStudentExample },
        },
      },
      portfolioVisualizer: {
        id: 'portfolioVisualizer',
        name: 'Portfolio Visualizer',
        difficulty: 'extreme',
        variants: {
          overview: { component: createProblemOverview(portfolioVisualizerProblem) },
          react: { component: PortfolioVisualizerExample },
          vanilla: { component: PortfolioVisualizerVanillaExample },
          studentReact: { component: PortfolioVisualizerStudentExample },
          studentVanilla: { component: PortfolioVisualizerStudentVanillaExample },
        },
      },
      markdown: {
        id: 'markdown',
        name: 'Markdown',
        difficulty: 'extreme',
        variants: {
          overview: { component: createProblemOverview(markdownProblem) },
          react: { component: MarkdownExample },
          studentReact: { component: MarkdownStudentExample },
        },
      },
      gptChat: {
        id: 'gptChat',
        name: 'GPT Chat',
        difficulty: 'extreme',
        variants: {
          overview: { component: createProblemOverview(gptChatProblem) },
          react: { component: GPTComponentExample },
          vanilla: { component: GPTChatVanillaExample },
          studentReact: { component: GptChatStudentExample },
          studentVanilla: { component: GptChatStudentVanillaExample },
        },
      },
      infiniteCanvas: {
        id: 'infiniteCanvas',
        name: 'Infinite Canvas',
        difficulty: 'extreme',
        variants: {
          overview: { component: createProblemOverview(infiniteCanvasProblem) },
          react: { component: InfiniteCanvasExample },
          studentReact: { component: InfiniteCanvasStudentExample },
        },
      },
      googleSheetParser: {
        id: '21.1',
        name: '21.1 Google Sheet Parser',
        difficulty: 'extreme',
        variants: {
          overview: { component: createProblemOverview(parserProblem) },
          example: { component: ParserExample },
        },
      },
      googleSheetTopo: {
        id: '21.2',
        name: '21.2 Google Sheet Topo Sort',
        difficulty: 'extreme',
        variants: {
          overview: { component: createProblemOverview(topoProblem) },
          example: { component: TopoExample },
        },
      },
      googleSheetEngine: {
        id: '21.3',
        name: '21.3 Google Sheet Engine',
        difficulty: 'extreme',
        variants: {
          overview: { component: createProblemOverview(tableEngineProblem) },
          example: { component: TableEngineExample },
        },
      },
      googleSheetUx: {
        id: '21.4',
        name: '21.4 Google Sheet UX',
        difficulty: 'extreme',
        variants: {
          overview: { component: createProblemOverview(googleSheetProblem) },
          react: { component: GoogleSheetExample },
          vanilla: { component: GoogleSheetVanillaExample },
          studentReact: { component: GoogleSheetStudentExample },
          studentVanilla: { component: GoogleSheetStudentVanillaExample },
        },
      },
    } as Record<string, TProblem>,
  },
  typescript: {
    title: 'TypeScript Challenges',
    items: {
      overview: {
        id: 'ts-overview',
        name: 'Course Overview',
        difficulty: 'warm-up',
        variants: {
          overview: { component: createProblemOverview(tsIndex) },
        },
      },
    },
  },
  tsBasics: {
    title: '1. Basics',
    items: {
      basicsOverview: {
        id: 'ts-basics-overview',
        name: 'Chapter Overview',
        difficulty: 'easy',
        variants: { overview: { component: createProblemOverview(tsBasicsIndex) } },
      },
      tupleLength: {
        id: 'tuple-length',
        name: 'Tuple Length',
        difficulty: 'easy',
        variants: { overview: { component: createProblemOverview(createTsCode(tsTupleLength)) } },
      },
      firstOfArray: {
        id: 'first-of-array',
        name: 'First of Array',
        difficulty: 'easy',
        variants: { overview: { component: createProblemOverview(createTsCode(tsFirstOfArray)) } },
      },
      tupleToUnion: {
        id: 'tuple-to-union',
        name: 'Tuple to Union',
        difficulty: 'easy',
        variants: { overview: { component: createProblemOverview(createTsCode(tsTupleToUnion)) } },
      },
    },
  },
  tsMappedTypes: {
    title: '2. Mapped Types',
    items: {
      mappedIndex: {
        id: 'ts-mapped-index',
        name: 'Chapter Overview',
        difficulty: 'medium',
        variants: { overview: { component: createProblemOverview(tsMappedIndex) } },
      },
      pick: {
        id: 'pick',
        name: 'Pick',
        difficulty: 'easy',
        variants: { overview: { component: createProblemOverview(createTsCode(tsPick)) } },
      },
      readonly: {
        id: 'readonly',
        name: 'Readonly',
        difficulty: 'easy',
        variants: { overview: { component: createProblemOverview(createTsCode(tsReadonly)) } },
      },
      mutable: {
        id: 'mutable',
        name: 'Mutable',
        difficulty: 'medium',
        variants: { overview: { component: createProblemOverview(createTsCode(tsMutable)) } },
      },
      tupleToObject: {
        id: 'tuple-to-object',
        name: 'Tuple to Object',
        difficulty: 'easy',
        variants: { overview: { component: createProblemOverview(createTsCode(tsTupleToObject)) } },
      },
      appendToObject: {
        id: 'append-to-object',
        name: 'Append to Object',
        difficulty: 'medium',
        variants: {
          overview: { component: createProblemOverview(createTsCode(tsAppendToObject)) },
        },
      },
      merge: {
        id: 'merge',
        name: 'Merge',
        difficulty: 'medium',
        variants: { overview: { component: createProblemOverview(createTsCode(tsMerge)) } },
      },
      diff: {
        id: 'diff',
        name: 'Diff',
        difficulty: 'medium',
        variants: { overview: { component: createProblemOverview(createTsCode(tsDiff)) } },
      },
    },
  },
  tsConditionalTypes: {
    title: '3. Conditional Types',
    items: {
      conditionalIndex: {
        id: 'ts-conditional-index',
        name: 'Chapter Overview',
        difficulty: 'hard',
        variants: { overview: { component: createProblemOverview(tsConditionalIndex) } },
      },
      if: {
        id: 'if',
        name: 'If',
        difficulty: 'easy',
        variants: { overview: { component: createProblemOverview(createTsCode(tsIf)) } },
      },
      exclude: {
        id: 'exclude',
        name: 'Exclude',
        difficulty: 'easy',
        variants: { overview: { component: createProblemOverview(createTsCode(tsExclude)) } },
      },
      isNever: {
        id: 'is-never',
        name: 'IsNever',
        difficulty: 'medium',
        variants: { overview: { component: createProblemOverview(createTsCode(tsIsNever)) } },
      },
      anyOf: {
        id: 'any-of',
        name: 'AnyOf',
        difficulty: 'hard',
        variants: { overview: { component: createProblemOverview(createTsCode(tsAnyOf)) } },
      },
      lookup: {
        id: 'lookup',
        name: 'LookUp',
        difficulty: 'medium',
        variants: { overview: { component: createProblemOverview(createTsCode(tsLookup)) } },
      },
    },
  },
  tsInfer: {
    title: '4. Infer',
    items: {
      inferIndex: {
        id: 'ts-infer-index',
        name: 'Chapter Overview',
        difficulty: 'hard',
        variants: { overview: { component: createProblemOverview(tsInferIndex) } },
      },
      returnType: {
        id: 'return-type',
        name: 'ReturnType',
        difficulty: 'medium',
        variants: { overview: { component: createProblemOverview(createTsCode(tsReturnType)) } },
      },
      parameters: {
        id: 'parameters',
        name: 'Parameters',
        difficulty: 'medium',
        variants: { overview: { component: createProblemOverview(createTsCode(tsParameters)) } },
      },
      awaited: {
        id: 'awaited',
        name: 'Awaited',
        difficulty: 'easy',
        variants: { overview: { component: createProblemOverview(createTsCode(tsAwaited)) } },
      },
      last: {
        id: 'last',
        name: 'Last of Array',
        difficulty: 'medium',
        variants: { overview: { component: createProblemOverview(createTsCode(tsLast)) } },
      },
      pop: {
        id: 'pop',
        name: 'Pop',
        difficulty: 'medium',
        variants: { overview: { component: createProblemOverview(createTsCode(tsPop)) } },
      },
      flatten: {
        id: 'flatten',
        name: 'Flatten',
        difficulty: 'hard',
        variants: { overview: { component: createProblemOverview(createTsCode(tsFlatten)) } },
      },
    },
  },
  tsTemplateLiterals: {
    title: '5. Template Literals',
    items: {
      templateIndex: {
        id: 'ts-template-index',
        name: 'Chapter Overview',
        difficulty: 'medium',
        variants: { overview: { component: createProblemOverview(tsTemplateIndex) } },
      },
      capitalize: {
        id: 'capitalize',
        name: 'Capitalize',
        difficulty: 'medium',
        variants: { overview: { component: createProblemOverview(createTsCode(tsCapitalize)) } },
      },
      trimLeft: {
        id: 'trim-left',
        name: 'Trim Left',
        difficulty: 'medium',
        variants: { overview: { component: createProblemOverview(createTsCode(tsTrimLeft)) } },
      },
      trim: {
        id: 'trim',
        name: 'Trim',
        difficulty: 'medium',
        variants: { overview: { component: createProblemOverview(createTsCode(tsTrim)) } },
      },
      replace: {
        id: 'replace',
        name: 'Replace',
        difficulty: 'medium',
        variants: { overview: { component: createProblemOverview(createTsCode(tsReplace)) } },
      },
      kebabCase: {
        id: 'kebab-case',
        name: 'Kebab Case',
        difficulty: 'hard',
        variants: { overview: { component: createProblemOverview(createTsCode(tsKebabCase)) } },
      },
      stringToUnion: {
        id: 'string-to-union',
        name: 'String to Union',
        difficulty: 'medium',
        variants: { overview: { component: createProblemOverview(createTsCode(tsStringToUnion)) } },
      },
      length: {
        id: 'length-of-string',
        name: 'Length of String',
        difficulty: 'hard',
        variants: { overview: { component: createProblemOverview(createTsCode(tsLength)) } },
      },
      startsEnds: {
        id: 'starts-ends-with',
        name: 'Starts/Ends With',
        difficulty: 'hard',
        variants: { overview: { component: createProblemOverview(createTsCode(tsStartsEnds)) } },
      },
    },
  },
  tsRecursiveTypes: {
    title: '6. Recursive Types',
    items: {
      recursiveIndex: {
        id: 'ts-recursive-index',
        name: 'Chapter Overview',
        difficulty: 'hard',
        variants: { overview: { component: createProblemOverview(tsRecursiveIndex) } },
      },
      deepReadonly: {
        id: 'deep-readonly',
        name: 'Deep Readonly',
        difficulty: 'medium',
        variants: { overview: { component: createProblemOverview(createTsCode(tsDeepReadonly)) } },
      },
      replaceAll: {
        id: 'replace-all',
        name: 'Replace All',
        difficulty: 'medium',
        variants: { overview: { component: createProblemOverview(createTsCode(tsReplaceAll)) } },
      },
      reverse: {
        id: 'reverse',
        name: 'Reverse',
        difficulty: 'medium',
        variants: { overview: { component: createProblemOverview(createTsCode(tsReverse)) } },
      },
      flattenDepth: {
        id: 'flatten-depth',
        name: 'Flatten Depth',
        difficulty: 'hard',
        variants: { overview: { component: createProblemOverview(createTsCode(tsFlattenDepth)) } },
      },
      fibonacci: {
        id: 'fibonacci',
        name: 'Fibonacci',
        difficulty: 'hard',
        variants: { overview: { component: createProblemOverview(createTsCode(tsFibonacci)) } },
      },
    },
  },
  tsDistributive: {
    title: '7. Distributive Conditionals',
    items: {
      distributiveIndex: {
        id: 'ts-distributive-index',
        name: 'Chapter Overview',
        difficulty: 'hard',
        variants: { overview: { component: createProblemOverview(tsDistributiveIndex) } },
      },
      isUnion: {
        id: 'is-union',
        name: 'IsUnion',
        difficulty: 'medium',
        variants: { overview: { component: createProblemOverview(createTsCode(tsIsUnion)) } },
      },
      permutation: {
        id: 'permutation',
        name: 'Permutation',
        difficulty: 'hard',
        variants: { overview: { component: createProblemOverview(createTsCode(tsPermutation)) } },
      },
    },
  },
  tsAdvancedPatterns: {
    title: '8. Advanced Patterns',
    items: {
      advancedIndex: {
        id: 'ts-advanced-index',
        name: 'Chapter Overview',
        difficulty: 'extreme',
        variants: { overview: { component: createProblemOverview(tsAdvancedIndex) } },
      },
      pickByType: {
        id: 'pick-by-type',
        name: 'PickByType',
        difficulty: 'hard',
        variants: { overview: { component: createProblemOverview(createTsCode(tsPickByType)) } },
      },
      omitByType: {
        id: 'omit-by-type',
        name: 'OmitByType',
        difficulty: 'hard',
        variants: { overview: { component: createProblemOverview(createTsCode(tsOmitByType)) } },
      },
      partialByKeys: {
        id: 'partial-by-keys',
        name: 'PartialByKeys',
        difficulty: 'hard',
        variants: { overview: { component: createProblemOverview(createTsCode(tsPartialByKeys)) } },
      },
      chunk: {
        id: 'chunk',
        name: 'Chunk',
        difficulty: 'hard',
        variants: { overview: { component: createProblemOverview(createTsCode(tsChunk)) } },
      },
    },
  },
  tsExpertTechniques: {
    title: '9. Expert Techniques',
    items: {
      expertIndex: {
        id: 'ts-expert-index',
        name: 'Chapter Overview',
        difficulty: 'extreme',
        variants: { overview: { component: createProblemOverview(tsExpertIndex) } },
      },
      unionToIntersection: {
        id: 'union-to-intersection',
        name: 'Union To Intersection',
        difficulty: 'hard',
        variants: {
          overview: { component: createProblemOverview(createTsCode(tsUnionToIntersection)) },
        },
      },
      isAny: {
        id: 'is-any',
        name: 'IsAny',
        difficulty: 'hard',
        variants: { overview: { component: createProblemOverview(createTsCode(tsIsAny)) } },
      },
      greaterThan: {
        id: 'greater-than',
        name: 'GreaterThan',
        difficulty: 'extreme',
        variants: { overview: { component: createProblemOverview(createTsCode(tsGreaterThan)) } },
      },
      transpose: {
        id: 'transpose',
        name: 'Transpose',
        difficulty: 'extreme',
        variants: { overview: { component: createProblemOverview(createTsCode(tsTranspose)) } },
      },
    },
  },
  typescriptProblems: {
    title: 'Typescript Problems',
    items: {} as Record<string, TProblem>,
  },
} as const

// Helper to find a component by selection id (format: "problemId:variant")
const findComponentBySelection = (selectionId: string): React.ComponentType | undefined => {
  const [problemId, variant] = selectionId.split(':') as [string, TVariantType]
  for (const section of Object.values(SECTIONS)) {
    if (problemId in section.items) {
      const problem = section.items[problemId as keyof typeof section.items] as TProblem
      return problem.variants[variant]?.component
    }
  }
  return undefined
}

// Check if a selection id is valid
const isValidSelection = (selectionId: string): boolean => {
  return findComponentBySelection(selectionId) !== undefined
}

const NotFound = () => <div>Not found</div>

export default function App() {
  // Read initial selection from URL param
  const getInitialExample = (): string => {
    const params = new URLSearchParams(window.location.search)
    const example = params.get('example')
    if (example && isValidSelection(example)) {
      return example
    }
    return 'tabs:react'
  }

  // Get initial open sections from localStorage or defaults
  const getInitialOpenSections = (): Record<string, boolean> => {
    const stored = localStorage.getItem('sidebarOpenSections')
    if (stored) {
      return JSON.parse(stored)
    }
    // Default: main chapters open
    return {
      javascriptProblems: true,
      components: true,
      typescript: true,
    }
  }

  const [selectedId, setSelectedId] = useState<string>(getInitialExample)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(getInitialOpenSections)

  const SelectedComponent = useMemo(() => findComponentBySelection(selectedId), [selectedId])

  // Update URL when selection changes
  const handleSelectVariant = (problemId: string, variant: TVariantType) => {
    const newId = `${problemId}:${variant}`
    setSelectedId(newId)
    const url = new URL(window.location.href)
    url.searchParams.set('example', newId)
    window.history.replaceState({}, '', url.toString())
  }

  // Handle section toggle and persist to localStorage
  const handleSectionToggle = (sectionKey: string, isOpen: boolean) => {
    setOpenSections((prev) => {
      const updated = { ...prev, [sectionKey]: isOpen }
      localStorage.setItem('sidebarOpenSections', JSON.stringify(updated))
      return updated
    })
  }

  return (
    <div className={css.app}>
      <div className={css.container}>
        <div className={css.sidebar}>
          {Object.entries(SECTIONS).map(([sectionKey, section]) => {
            const showSeparator = sectionKey === 'components' || sectionKey === 'typescript'

            return (
              <div key={sectionKey}>
                {showSeparator && <hr className={css.sectionDivider} />}
                <details
                  className={css.sidebarSection}
                  open={openSections[sectionKey] ?? false}
                  onToggle={(e) =>
                    handleSectionToggle(sectionKey, (e.target as HTMLDetailsElement).open)
                  }
                >
                  <summary className={css.sectionTitle}>{section.title}</summary>
                  {Object.keys(section.items).length === 0 ? (
                    <p className={css.emptySection}>No items yet</p>
                  ) : (
                    <ul className={css.problemList}>
                      {Object.entries(section.items).map(([problemId, problem], index) => (
                        <li key={problemId} className={css.problemItem}>
                          <div className={css.problemHeader}>
                            <span className={css.problemName}>
                              {/^\d/.test(problem.name)
                                ? problem.name
                                : `${index + 1}. ${problem.name}`}
                            </span>
                            <span className={`${css.chip} ${css[problem.difficulty]}`}>
                              {problem.difficulty}
                            </span>
                          </div>
                          <ul className={css.variantList}>
                            {(Object.keys(problem.variants) as TVariantType[]).map((variant) => (
                              <li key={variant}>
                                <button
                                  className={
                                    selectedId === `${problemId}:${variant}` ? css.active : ''
                                  }
                                  onClick={() => handleSelectVariant(problemId, variant)}
                                >
                                  {variant === 'overview'
                                    ? 'Problem Overview'
                                    : variant === 'react'
                                      ? 'Reference (React)'
                                      : variant === 'vanilla'
                                        ? 'Reference (Vanilla)'
                                        : variant === 'studentReact'
                                          ? 'Student (React)'
                                          : variant === 'studentVanilla'
                                            ? 'Student (Vanilla)'
                                            : 'Example'}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  )}
                </details>
              </div>
            )
          })}
        </div>
        <div className={css.content}>
          {/* eslint-disable-next-line react-hooks/static-components */}
          {SelectedComponent ? <SelectedComponent /> : <NotFound />}
        </div>
      </div>
    </div>
  )
}
