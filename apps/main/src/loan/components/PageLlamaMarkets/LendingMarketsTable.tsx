import Stack from '@mui/material/Stack'
import { SizesAndSpaces } from '@ui-kit/themes/design/1_sizes_spaces'
import { TableFilters, useColumnFilters } from '@ui-kit/shared/ui/TableFilters'
import { t } from '@ui-kit/lib/i18n'
import { CompactUsdCell, LineGraphCell, PoolTitleCell, RateCell, UtilizationCell } from './cells'
import { DataTable } from '@ui-kit/shared/ui/DataTable'
import { LlamaMarket } from '@/loan/entities/llama-markets'
import {
  ColumnDef,
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { LendingMarketsFilters } from '@/loan/components/PageLlamaMarkets/LendingMarketsFilters'
import { useSortFromQueryString } from '@ui-kit/hooks/useSortFromQueryString'
import { DeepKeys } from '@tanstack/table-core/build/lib/utils'
import { useVisibilitySettings, VisibilityGroup } from '@ui-kit/shared/ui/TableVisibilitySettingsPopover'

const { ColumnWidth, Spacing, MaxWidth } = SizesAndSpaces

const columnHelper = createColumnHelper<LlamaMarket>()

/** Define a hidden column. */
const hidden = (id: DeepKeys<LlamaMarket>) =>
  columnHelper.accessor(id, {
    filterFn: (row, columnId, filterValue) => !filterValue?.length || filterValue.includes(row.getValue(columnId)),
    meta: { hidden: true },
  })

const [borrowChartId, lendChartId] = ['borrowChart', 'lendChart']

/** Columns for the lending markets table. */
const columns = [
  columnHelper.accessor('assets', {
    header: t`Collateral • Borrow`,
    cell: PoolTitleCell,
    size: ColumnWidth.lg,
  }),
  columnHelper.accessor('rates.borrow', {
    header: t`7D Avg Borrow Rate`,
    cell: (c) => <RateCell market={c.row.original} type="borrow" />,
    meta: { type: 'numeric' },
    size: ColumnWidth.sm,
  }),
  columnHelper.accessor('rates.borrow', {
    id: borrowChartId,
    header: t`7D Borrow Rate Chart`,
    cell: (c) => <LineGraphCell market={c.row.original} type="borrow" />,
    size: ColumnWidth.md,
    enableSorting: false,
  }),
  columnHelper.accessor('rates.lend', {
    header: t`7D Avg Supply Yield`,
    cell: (c) => <RateCell market={c.row.original} type="lend" />,
    meta: { type: 'numeric' },
    size: ColumnWidth.sm,
    sortUndefined: 'last',
  }),
  columnHelper.accessor('rates.lend', {
    id: lendChartId,
    header: t`7D Supply Yield Chart`,
    cell: (c) => <LineGraphCell market={c.row.original} type="lend" />,
    size: ColumnWidth.md,
    sortUndefined: 'last',
    enableSorting: false,
  }),
  columnHelper.accessor('utilizationPercent', {
    header: t`Utilization`,
    cell: UtilizationCell,
    meta: { type: 'numeric' },
    size: ColumnWidth.sm,
  }),
  columnHelper.accessor('totalSupplied.usdTotal', {
    header: () => t`Available Liquidity`,
    cell: CompactUsdCell,
    meta: { type: 'numeric' },
    size: ColumnWidth.sm,
  }),
  // following columns are used to configure and filter tanstack, but they are displayed together in PoolTitleCell
  hidden('blockchainId'),
  hidden('assets.collateral.symbol'),
  hidden('assets.borrowed.symbol'),
] satisfies ColumnDef<LlamaMarket, any>[]

const DEFAULT_SORT = [{ id: 'totalSupplied.usdTotal', desc: true }]

const DEFAULT_VISIBILITY: VisibilityGroup[] = [
  {
    label: t`Markets`,
    options: [
      { label: t`Available Liquidity`, id: 'totalSupplied.usdTotal', active: true },
      { label: t`Utilization`, id: 'utilizationPercent', active: true },
    ],
  },
  {
    label: t`Borrow`,
    options: [{ label: t`Chart`, id: borrowChartId, active: true }],
  },
  {
    label: t`Lend`,
    options: [{ label: t`Chart`, id: lendChartId, active: true }],
  },
]

export const LendingMarketsTable = ({
  onReload,
  data,
  headerHeight,
}: {
  onReload: () => void
  data: LlamaMarket[]
  headerHeight: string
}) => {
  const [columnFilters, columnFiltersById, setColumnFilter] = useColumnFilters()
  const { columnSettings, columnVisibility, toggleVisibility } = useVisibilitySettings(DEFAULT_VISIBILITY)

  const [sorting, onSortingChange] = useSortFromQueryString(DEFAULT_SORT)
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, columnVisibility, columnFilters },
    onSortingChange,
    maxMultiSortColCount: 3, // allow 3 columns to be sorted at once
  })

  return (
    <Stack
      sx={{
        marginBlockStart: Spacing.xl,
        marginBlockEnd: Spacing.xxl,
        maxWidth: MaxWidth.table,
      }}
    >
      <DataTable table={table} headerHeight={headerHeight} rowHeight="3xl" emptyText={t`No markets found`}>
        <TableFilters
          title={t`Llamalend Markets`}
          subtitle={t`Select a market to view more details`}
          onReload={onReload}
          learnMoreUrl="https://docs.curve.fi/lending/overview/"
          visibilityGroups={columnSettings}
          toggleVisibility={toggleVisibility}
        >
          <LendingMarketsFilters columnFilters={columnFiltersById} setColumnFilter={setColumnFilter} data={data} />
        </TableFilters>
      </DataTable>
    </Stack>
  )
}
