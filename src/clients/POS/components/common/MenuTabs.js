import SelectableButton from '../common/SelectableButton';

export default function MenuTabs({ categories, selected, onSelect }) {
    return (
        <div className="flex gap-3">
            {categories.map((category) => (
                <SelectableButton
                    key={category}
                    isSelected={selected === category}
                    onClick={() => onSelect(category)}
                    className="px-4 py-2 w-auto h-12"
                >
                    <span className={`text-sm font-medium ${selected === category ? 'text-brandGreen' : 'text-gray-700'}`}>
                        {category}
                    </span>
                </SelectableButton>
            ))}
        </div>
    );
}
