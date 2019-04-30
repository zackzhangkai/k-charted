import * as React from 'react';
import { style } from 'typestyle';
import { Grid, GridItem } from '@patternfly/react-core';
import { AngleDoubleLeftIcon } from '@patternfly/react-icons';

import { AllPromLabelsValues } from '../../types/Labels';
import { DashboardModel, ChartModel } from '../../types/Dashboards';
import { getDataSupplier } from '../../utils/victoryChartsUtils';
import KChart from './KChart';

const expandedChartContainerStyle = style({
  height: 'calc(100vh - 248px)'
});

const expandedChartBackLinkStyle = style({
  marginTop: '5px',
  textAlign: 'right'
});

type Props = {
  dashboard: DashboardModel;
  labelValues: AllPromLabelsValues;
  expandedChart?: string;
  expandHandler: (expandedChart?: string) => void;
};

type State = {
  expandedChart?: string;
};

export class Dashboard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      expandedChart: props.expandedChart
    };
  }

  render() {
    if (this.state.expandedChart) {
      return (
        <>
          <h3 className={expandedChartBackLinkStyle}>
            <a href="#" onClick={this.unexpandHandler}>
              <AngleDoubleLeftIcon /> View all metrics
            </a>
          </h3>
          {this.renderExpandedChart(this.state.expandedChart)}
        </>
      );
    }
    return this.renderMetrics();
  }

  renderMetrics() {
    return (
      <Grid>{this.props.dashboard.charts.map(c => this.renderChartCard(c))}</Grid>
    );
  }

  private renderExpandedChart(chartKey: string) {
    const chart = this.props.dashboard.charts.find(c => c.name === chartKey);
    if (chart) {
      return <div className={expandedChartContainerStyle}>{this.renderChart(chart)}</div>;
    }
    return undefined;
  }

  private renderChartCard(chart: ChartModel) {
    return (
      <GridItem span={chart.spans} key={chart.name}>
        {this.renderChart(chart, () => this.expandHandler(chart.name))}
      </GridItem>
    );
  }

  private renderChart(chart: ChartModel, expandHandler?: () => void) {
    const dataSupplier = getDataSupplier(chart, this.props.labelValues);
    if (dataSupplier) {
      return (
        <KChart
          key={chart.name}
          chart={chart}
          dataSupplier={dataSupplier}
          expandHandler={expandHandler}
        />
      );
    }
    return undefined;
  }

  private expandHandler = (chartKey: string): void => {
    this.setState({ expandedChart: chartKey });
    this.props.expandHandler(chartKey);
  };

  private unexpandHandler = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    this.setState({ expandedChart: undefined });
    this.props.expandHandler();
  };
}
