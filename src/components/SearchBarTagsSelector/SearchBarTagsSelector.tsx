import './SearchBarTagsSelector.scss';

import React, { useState } from 'react';

import { TagColor } from '../../theme/tagColor';
import { ObjectWithNameAndId } from '../../types/objectWithNameAndId';
import AutocompleteSearchBar from '../AutocompleteSearchBar/AutocompleteSearchBar';
import Tag from '../Tag/Tag';

type SearchBarTagsSelectorProps = {
  getSuggestions: (input: string) => Promise<ObjectWithNameAndId[] | null>;
  onElementChosen: (element: ObjectWithNameAndId) => void;
  onElementRemoved: (elementId: string) => void;
  selectedElements?: ObjectWithNameAndId[];
  tagsColor?: string;
  placeholder?: string;
  label?: string;
};

const SearchBarTagsSelector = ({
  getSuggestions,
  onElementChosen,
  onElementRemoved,
  selectedElements = [],
  tagsColor = TagColor.INGREDIENT,
  placeholder,
  label,
}: SearchBarTagsSelectorProps): JSX.Element => {
  const [suggestions, setSuggestions] = useState<ObjectWithNameAndId[] | null>(
    null,
  );

  const onChange = async (value: string) => {
    const newSuggestions = await getSuggestions(value);
    setSuggestions(newSuggestions);
  };

  const onSuggestionClick = (suggestion: ObjectWithNameAndId) => {
    const isElementPresent = selectedElements.some(
      (element) => element.id === suggestion.id,
    );
    if (!isElementPresent) {
      onElementChosen(suggestion);
    }
  };

  return (
    <div className="search-bar-selector">
      <AutocompleteSearchBar
        label={label}
        placeholder={placeholder}
        suggestions={suggestions ?? undefined}
        onChange={onChange}
        onSuggestionClick={onSuggestionClick}
      />
      {selectedElements.length > 0 && (
        <div className="tag-container">
          <div className="tags">
            {selectedElements.map((element: ObjectWithNameAndId) => (
              <Tag
                key={element.id}
                text={element.name}
                color={tagsColor}
                onDelete={() => onElementRemoved(element.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBarTagsSelector;
