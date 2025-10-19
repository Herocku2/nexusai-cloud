'use client'

import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, TrendingUp, Network } from 'lucide-react'

interface TreeNode {
  user_id: string
  email: string
  first_name: string
  last_name: string
  parent_id: string | null
  position: 'left' | 'right' | null
  depth: number
  left_volume: number
  right_volume: number
  status: string
  children?: TreeNode[]
}

interface BinaryTreeVisualizationProps {
  data: TreeNode[]
  currentUserId: string
}

export default function BinaryTreeVisualization({ data, currentUserId }: BinaryTreeVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null)

  useEffect(() => {
    if (!svgRef.current || !data || data.length === 0) return

    // Clear previous render
    d3.select(svgRef.current).selectAll('*').remove()

    const width = 1200
    const height = 600
    const nodeRadius = 40

    // Transform flat data into hierarchical structure
    const root = buildTree(data, currentUserId)
    if (!root) return

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)

    const g = svg.append('g')
      .attr('transform', `translate(${width / 2}, 50)`)

    // Create tree layout
    const treeLayout = d3.tree<TreeNode>()
      .size([width - 200, height - 100])
      .separation((a, b) => (a.parent === b.parent ? 1 : 1.2))

    const hierarchyRoot = d3.hierarchy(root)
    const treeData = treeLayout(hierarchyRoot)

    // Draw links
    g.selectAll('.link')
      .data(treeData.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', d3.linkVertical<any, any>()
        .x((d: any) => d.x - width / 2)
        .y((d: any) => d.y)
      )
      .attr('fill', 'none')
      .attr('stroke', '#94a3b8')
      .attr('stroke-width', 2)

    // Draw nodes
    const nodes = g.selectAll('.node')
      .data(treeData.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d: any) => `translate(${d.x - width / 2}, ${d.y})`)
      .style('cursor', 'pointer')
      .on('click', function(event, d) {
        setSelectedNode(d.data as TreeNode)
      })

    // Node circles
    nodes.append('circle')
      .attr('r', nodeRadius)
      .attr('fill', (d: any) => {
        if (d.data.user_id === currentUserId) return '#3b82f6' // Blue for current user
        if (d.data.status === 'active') return '#10b981' // Green for active
        return '#94a3b8' // Gray for inactive
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 3)
      .style('filter', 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))')

    // User icons
    nodes.append('text')
      .attr('dy', '0.3em')
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff')
      .attr('font-size', '20px')
      .text('👤')

    // User names
    nodes.append('text')
      .attr('dy', nodeRadius + 20)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .attr('fill', '#1e293b')
      .text((d: any) => {
        const node = d.data as TreeNode
        return `${node.first_name || ''} ${node.last_name || ''}`.trim() || 'User'
      })

    // Position labels
    nodes.append('text')
      .attr('dy', nodeRadius + 35)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', '#64748b')
      .text((d: any) => {
        const node = d.data as TreeNode
        if (!node.position) return 'Root'
        return node.position === 'left' ? 'Left Leg' : 'Right Leg'
      })

    // Volume indicators
    nodes.filter((d: any) => d.data.left_volume > 0 || d.data.right_volume > 0)
      .append('text')
      .attr('dy', -nodeRadius - 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .attr('fill', '#7c3aed')
      .text((d: any) => {
        const node = d.data as TreeNode
        return `${node.left_volume + node.right_volume} PV`
      })

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 2])
      .on('zoom', (event) => {
        g.attr('transform', `translate(${width / 2 + event.transform.x}, ${50 + event.transform.y}) scale(${event.transform.k})`)
      })

    svg.call(zoom as any)

  }, [data, currentUserId])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Interactive Binary Tree</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg overflow-hidden border">
            <svg ref={svgRef} className="w-full h-[600px]" />
            
            <div className="absolute top-4 right-4 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg">
              <h4 className="text-sm font-semibold mb-2">Legend</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                  <span>You</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span>Active Member</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-slate-400"></div>
                  <span>Inactive</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs text-muted-foreground">
                  💡 Click nodes to see details<br/>
                  🔍 Scroll to zoom<br/>
                  ✋ Drag to pan
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Node Details */}
      {selectedNode && (
        <Card>
          <CardHeader>
            <CardTitle>Member Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-semibold">
                  {selectedNode.first_name} {selectedNode.last_name}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-semibold text-sm">{selectedNode.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Position</p>
                <p className="font-semibold capitalize">
                  {selectedNode.position || 'Root'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Level</p>
                <p className="font-semibold">{selectedNode.depth}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Left Volume</p>
                <p className="font-semibold text-blue-600">
                  {selectedNode.left_volume} PV
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Right Volume</p>
                <p className="font-semibold text-orange-600">
                  {selectedNode.right_volume} PV
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Volume</p>
                <p className="font-semibold text-purple-600">
                  {selectedNode.left_volume + selectedNode.right_volume} PV
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                  selectedNode.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {selectedNode.status}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Helper function to build tree structure from flat array
function buildTree(nodes: TreeNode[], rootId: string): TreeNode | null {
  const nodeMap = new Map<string, TreeNode>()
  
  // Create map of all nodes
  nodes.forEach(node => {
    nodeMap.set(node.user_id, { ...node, children: [] })
  })
  
  // Find root
  const root = nodeMap.get(rootId)
  if (!root) return null
  
  // Build tree structure
  nodes.forEach(node => {
    if (node.parent_id && node.parent_id !== rootId) {
      const parent = nodeMap.get(node.parent_id)
      const child = nodeMap.get(node.user_id)
      if (parent && child) {
        if (!parent.children) parent.children = []
        parent.children.push(child)
      }
    } else if (node.user_id !== rootId) {
      // Direct children of root
      const child = nodeMap.get(node.user_id)
      if (child && root.children) {
        root.children.push(child)
      }
    }
  })
  
  return root
}
