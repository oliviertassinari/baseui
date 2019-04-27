/*
Copyright (c) 2018 Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
// @flow
import * as React from 'react';
import memoize from 'memoize-one';
// Files
import {LocaleContext} from '../locale/index.js';
import {Select} from '../select/index.js';
import {Button, StyledBaseButton, KIND} from '../button/index.js';
import {mergeStyleOverrides} from '../helpers/overrides.js';
import {
  StyledRoot,
  StyledMaxLabel,
  StyledDropdownContainer,
} from './styled-components.js';
import ChevronLeft from '../icon/chevron-left.js';
import ChevronRight from '../icon/chevron-right.js';
import {getOverrides} from '../helpers/overrides.js';
import type {PaginationPropsT, PaginationStateT} from './types.js';
import type {OnItemSelectFnT} from '../menu/types.js';

export default class Pagination extends React.PureComponent<
  PaginationPropsT,
  PaginationStateT,
> {
  static defaultProps = {
    labels: {},
    overrides: {},
  };

  getMenuOptions = memoize((numPages: number) => {
    const menuOptions = [];
    for (let i = 1; i <= numPages; i++) {
      menuOptions.push({label: i});
    }
    return menuOptions;
  });

  onMenuItemSelect: OnItemSelectFnT = ({item}) => {
    const {onPageChange, currentPage} = this.props;
    const page = item.label;
    if (page !== currentPage) {
      onPageChange && onPageChange({nextPage: page, prevPage: currentPage});
    }
  };

  onPrevClick = (event: SyntheticEvent<>) => {
    const {currentPage, onPageChange, onPrevClick} = this.props;
    onPageChange &&
      onPageChange({nextPage: currentPage - 1, prevPage: currentPage});
    onPrevClick && onPrevClick({event});
  };

  onNextClick = (event: SyntheticEvent<>) => {
    const {currentPage, onPageChange, onNextClick} = this.props;
    onPageChange &&
      onPageChange({nextPage: currentPage + 1, prevPage: currentPage});
    onNextClick && onNextClick({event});
  };

  render() {
    const {overrides = {}, currentPage, labels, numPages} = this.props;

    const [Root, rootProps] = getOverrides(overrides.Root, StyledRoot);
    const [PrevButton, prevButtonProps] = getOverrides(
      overrides.PrevButton,
      StyledBaseButton,
    );
    const [NextButton, nextButtonProps] = getOverrides(
      overrides.NextButton,
      StyledBaseButton,
    );
    const [MaxLabel, maxLabelProps] = getOverrides(
      overrides.MaxLabel,
      StyledMaxLabel,
    );
    const [DropdownContainer, dropdownContainerProps] = getOverrides(
      overrides.DropdownContainer,
      StyledDropdownContainer,
    );

    const options = this.getMenuOptions(numPages);

    return (
      <LocaleContext.Consumer>
        {locale => (
          <Root data-baseweb="pagination" {...rootProps}>
            <Button
              onClick={this.onPrevClick}
              startEnhancer={() => <ChevronLeft title={''} size={24} />}
              kind={KIND.tertiary}
              overrides={{
                BaseButton: PrevButton,
              }}
              {...prevButtonProps}
            >
              {labels && labels.prevButton
                ? labels.prevButton
                : locale.pagination.prev}
            </Button>
            <DropdownContainer {...dropdownContainerProps}>
              <Select
                options={options}
                labelKey="label"
                valueKey="label"
                onChange={data => {
                  this.onMenuItemSelect({item: data.value[0]});
                }}
                searchable={false}
                clearable={false}
                value={[{label: currentPage}]}
                overrides={{
                  ControlContainer: {
                    style: ({
                      $theme,
                      $disabled,
                      $isFocused,
                      $isPseudoFocused,
                      $error,
                    }) => ({
                      borderWidth: '0',
                      boxShadow: 'none',
                      backgroundColor: $disabled
                        ? $theme.colors.inputFillDisabled
                        : $isFocused || $isPseudoFocused
                          ? $theme.colors.mono400
                          : $error
                            ? $theme.colors.negative50
                            : $theme.colors.inputFill,
                    }),
                  },
                  ValueContainer: {
                    style: ({$theme}) => ({
                      paddingTop: $theme.sizing.scale300,
                      paddingBottom: $theme.sizing.scale300,
                    }),
                  },
                  SingleValue: {
                    style: ({$theme}) => ({
                      position: 'relative',
                      paddingTop: '0',
                      paddingBottom: '0',
                      paddingLeft: '6px',
                      paddingRight: '12px',
                      color: $theme.colors.primary,
                      ...$theme.typography.font450,
                    }),
                  },
                  SelectArrow: {
                    style: ({$theme}) => ({
                      width: '24px',
                      height: '24px',
                      color: $theme.colors.primary,
                    }),
                  },
                }}
              />
            </DropdownContainer>
            <MaxLabel {...maxLabelProps}>
              {`${
                labels && labels.preposition
                  ? labels.preposition
                  : locale.pagination.preposition || ''
              } ${numPages}`}
            </MaxLabel>
            <Button
              onClick={this.onNextClick}
              endEnhancer={() => <ChevronRight title={''} size={24} />}
              kind={KIND.tertiary}
              overrides={{
                BaseButton: NextButton,
              }}
              {...nextButtonProps}
            >
              {labels && labels.nextButton
                ? labels.nextButton
                : locale.pagination.next}
            </Button>
          </Root>
        )}
      </LocaleContext.Consumer>
    );
  }
}
