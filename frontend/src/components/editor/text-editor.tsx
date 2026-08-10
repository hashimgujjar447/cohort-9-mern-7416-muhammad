import { useEffect } from "react";
import {
  Editor,
  EditorContent,
  useEditor,
  useEditorState,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";

import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Pilcrow,
  Underline as UnderlineIcon,
} from "lucide-react";

import EditorToggleButton from "../ui/EditorToggleButton";

interface TiptapProps {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
}

const Tiptap = ({
  content = "",
  onChange,
  placeholder = "Write your note content here...",
}: TiptapProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
      }),
      Underline,
      Placeholder.configure({
        placeholder,
      }),
    ],

    content,

    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },

    editorProps: {
      attributes: {
        class:
          "tiptap min-h-[250px] w-full rounded-xl border border-gray-200 bg-white p-5 outline-none focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-gray-800",
      },
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const isHtml = /<[a-z][\s\S]*>/i.test(content);

    const formattedContent = isHtml
      ? content
      : content
          .split("\n")
          .map((line) => `<p>${line || "<br>"}</p>`)
          .join("");

    if (editor.getHTML() === formattedContent) {
      return;
    }

    editor.commands.setContent(formattedContent, {
      emitUpdate: false,
    });
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full">
      <Toolbar editor={editor} />

      <EditorContent editor={editor} className="w-full" />
    </div>
  );
};

interface ToolbarProps {
  editor: Editor;
}

const Toolbar = ({ editor }: ToolbarProps) => {
  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      isParagraph: ctx.editor.isActive("paragraph"),
      isBold: ctx.editor.isActive("bold"),
      isItalic: ctx.editor.isActive("italic"),
      isUnderline: ctx.editor.isActive("underline"),
      isHeading1: ctx.editor.isActive("heading", { level: 1 }),
      isHeading2: ctx.editor.isActive("heading", { level: 2 }),
      isBulletList: ctx.editor.isActive("bulletList"),
      isOrderedList: ctx.editor.isActive("orderedList"),
    }),
  });

  return (
    <div className="mb-3 flex flex-wrap items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 p-2">
      <EditorToggleButton
        title="Paragraph"
        icon={<Pilcrow size={18} />}
        isActive={editorState.isParagraph}
        onClick={() => editor.chain().focus().setParagraph().run()}
      />

      <EditorToggleButton
        title="Heading 1"
        icon={<span className="text-sm font-bold">H1</span>}
        isActive={editorState.isHeading1}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      />

      <EditorToggleButton
        title="Heading 2"
        icon={<span className="text-sm font-bold">H2</span>}
        isActive={editorState.isHeading2}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      />

      <div className="mx-1 h-6 w-px bg-gray-300" />

      <EditorToggleButton
        title="Bold"
        icon={<Bold size={18} />}
        isActive={editorState.isBold}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />

      <EditorToggleButton
        title="Italic"
        icon={<Italic size={18} />}
        isActive={editorState.isItalic}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />

      <EditorToggleButton
        title="Underline"
        icon={<UnderlineIcon size={18} />}
        isActive={editorState.isUnderline}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      />

      <div className="mx-1 h-6 w-px bg-gray-300" />

      <EditorToggleButton
        title="Bullet List"
        icon={<List size={18} />}
        isActive={editorState.isBulletList}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />

      <EditorToggleButton
        title="Ordered List"
        icon={<ListOrdered size={18} />}
        isActive={editorState.isOrderedList}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      />
    </div>
  );
};

export default Tiptap;
