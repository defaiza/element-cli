import { Logger } from '../utils/logger';
import { createApiClient } from '../services/api';
import { configManager } from '../utils/config';
import Table from 'cli-table3';
import chalk from 'chalk';

const logger = new Logger();

interface StatsOptions {
  days?: string;
  format?: string;
}

export async function statsCommand(elementId?: string, options: StatsOptions = {}) {
  try {
    // Check if logged in
    const apiKey = await configManager.get('apiKey');
    if (!apiKey) {
      logger.error('You must be logged in to view stats. Run "defai-element login" first.');
      process.exit(1);
    }
    
    logger.loading('Fetching element statistics...');
    
    const apiClient = await createApiClient();
    const stats = await apiClient.getStats(elementId);
    
    // Format output based on option
    const format = options.format || 'table';
    const days = parseInt(options.days || '30');
    
    if (format === 'json') {
      console.log(JSON.stringify(stats, null, 2));
      return;
    }
    
    if (format === 'csv') {
      outputCSV(stats);
      return;
    }
    
    // Default table format
    if (Array.isArray(stats)) {
      // Multiple elements
      outputMultipleElementsTable(stats, days);
    } else {
      // Single element
      outputSingleElementTable(stats, elementId || 'Unknown', days);
    }
    
  } catch (error) {
    logger.error(`Stats error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    process.exit(1);
  }
}

function outputMultipleElementsTable(stats: any[], days: number) {
  logger.success(`Element statistics (last ${days} days)`);
  
  const table = new Table({
    head: ['Element', 'Downloads', 'Revenue', 'Rating', 'Reviews'],
    colWidths: [30, 15, 15, 10, 10],
    style: {
      head: ['cyan']
    }
  });
  
  let totalDownloads = 0;
  let totalRevenue = 0;
  
  stats.forEach(element => {
    totalDownloads += element.downloads;
    totalRevenue += element.revenue;
    
    table.push([
      element.name,
      element.downloads.toLocaleString(),
      `$${element.revenue.toFixed(2)}`,
      element.rating ? `${element.rating.toFixed(1)} ⭐` : 'N/A',
      element.reviews.toString()
    ]);
  });
  
  // Add summary row
  table.push([
    chalk.bold('Total'),
    chalk.bold(totalDownloads.toLocaleString()),
    chalk.bold(`$${totalRevenue.toFixed(2)}`),
    '',
    ''
  ]);
  
  console.log(table.toString());
  
  // Additional insights
  if (stats.length > 0) {
    const avgRevenue = totalRevenue / stats.length;
    const topPerformer = stats.reduce((prev, current) => 
      prev.revenue > current.revenue ? prev : current
    );
    
    logger.info('\nInsights:');
    logger.info(`• Average revenue per element: $${avgRevenue.toFixed(2)}`);
    logger.info(`• Top performer: ${topPerformer.name} ($${topPerformer.revenue.toFixed(2)})`);
    logger.info(`• Total elements: ${stats.length}`);
  }
}

function outputSingleElementTable(stats: any, elementId: string, days: number) {
  logger.success(`Statistics for element: ${stats.name || elementId}`);
  logger.info(`Period: Last ${days} days`);
  
  const summaryTable = new Table({
    style: { head: ['cyan'] }
  });
  
  summaryTable.push(
    { 'Total Downloads': stats.downloads.toLocaleString() },
    { 'Total Revenue': `$${stats.revenue.toFixed(2)}` },
    { 'Average Rating': stats.rating ? `${stats.rating.toFixed(1)} ⭐ (${stats.reviews} reviews)` : 'No ratings yet' },
    { 'Active Users': stats.activeUsers?.toLocaleString() || 'N/A' },
    { 'Conversion Rate': stats.conversionRate ? `${(stats.conversionRate * 100).toFixed(1)}%` : 'N/A' }
  );
  
  console.log(summaryTable.toString());
  
  // Daily breakdown if available
  if (stats.dailyStats && stats.dailyStats.length > 0) {
    console.log('\nDaily Breakdown:');
    
    const dailyTable = new Table({
      head: ['Date', 'Downloads', 'Revenue', 'Users'],
      colWidths: [15, 12, 12, 10],
      style: { head: ['cyan'] }
    });
    
    stats.dailyStats.slice(-10).forEach((day: any) => {
      dailyTable.push([
        new Date(day.date).toLocaleDateString(),
        day.downloads.toString(),
        `$${day.revenue.toFixed(2)}`,
        day.users?.toString() || '-'
      ]);
    });
    
    console.log(dailyTable.toString());
  }
  
  // Revenue breakdown if available
  if (stats.revenueBreakdown) {
    console.log('\nRevenue Breakdown:');
    
    const revenueTable = new Table({
      head: ['Source', 'Amount', 'Percentage'],
      colWidths: [20, 15, 15],
      style: { head: ['cyan'] }
    });
    
    Object.entries(stats.revenueBreakdown).forEach(([source, amount]: [string, any]) => {
      const percentage = ((amount / stats.revenue) * 100).toFixed(1);
      revenueTable.push([
        source,
        `$${amount.toFixed(2)}`,
        `${percentage}%`
      ]);
    });
    
    console.log(revenueTable.toString());
  }
  
  // Performance metrics
  if (stats.performance) {
    console.log('\nPerformance Metrics:');
    const perfTable = new Table({
      style: { head: ['cyan'] }
    });
    
    perfTable.push(
      { 'Load Time': `${stats.performance.loadTime || 'N/A'} ms` },
      { 'Error Rate': `${(stats.performance.errorRate * 100).toFixed(2)}%` },
      { 'Uptime': `${(stats.performance.uptime * 100).toFixed(2)}%` }
    );
    
    console.log(perfTable.toString());
  }
}

function outputCSV(stats: any) {
  if (Array.isArray(stats)) {
    // CSV header
    console.log('Element,Downloads,Revenue,Rating,Reviews');
    
    // CSV data
    stats.forEach(element => {
      console.log(`"${element.name}",${element.downloads},${element.revenue},${element.rating || ''},${element.reviews}`);
    });
  } else {
    // Single element CSV
    console.log('Metric,Value');
    console.log(`Downloads,${stats.downloads}`);
    console.log(`Revenue,${stats.revenue}`);
    console.log(`Rating,${stats.rating || ''}`);
    console.log(`Reviews,${stats.reviews}`);
    console.log(`Active Users,${stats.activeUsers || ''}`);
  }
} 