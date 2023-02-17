/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel;

import java.util.List;

import org.eclipse.glsp.graph.GEdge;
import org.eclipse.glsp.graph.GLabel;
import org.eclipse.glsp.graph.builder.impl.GEdgeBuilder;
import org.eclipse.glsp.graph.builder.impl.GEdgePlacementBuilder;
import org.eclipse.glsp.graph.builder.impl.GLabelBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.PackageImport;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.core.constants.CoreTypes;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_PackageImport;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGEdgeMapper;

public final class PackageImportEdgeMapper extends BaseGEdgeMapper<PackageImport, GEdge> {

   @Override
   public GEdge map(final PackageImport source) {
      var nearestPackage = source.getNearestPackage();
      var nearestPackageId = idGenerator.getOrCreateId(nearestPackage);
      var importedPackage = source.getImportedPackage();
      var importedPackageId = idGenerator.getOrCreateId(importedPackage);

      GEdgeBuilder builder = new GEdgeBuilder(UmlClass_PackageImport.TYPE_ID)
         .id(idGenerator.getOrCreateId(source))
         .addCssClasses(List.of(CoreCSS.EDGE, CoreCSS.EDGE_DASHED))
         .addCssClass(CoreCSS.Marker.TENT.end())
         .sourceId(nearestPackageId)
         .targetId(importedPackageId)
         .routerKind(GConstants.RouterKind.MANHATTAN)
         .add(
            createEdgeLabel("<<import>>", 0.5d, idCountGenerator.getOrCreateId(source), CoreTypes.LABEL_TEXT,
               GConstants.EdgeSide.TOP));

      applyEdgeNotation(source, builder);

      return builder.build();
   }

   protected GLabel createEdgeNameLabel(final String name, final String id, final double position) {
      return createEdgeLabel(name, position, id, CoreTypes.LABEL_EDGE_NAME,
         GConstants.EdgeSide.TOP);
   }

   protected GLabel createEdgeLabel(final String name, final double position, final String id, final String type,
      final String side) {
      return new GLabelBuilder(type)
         .edgePlacement(new GEdgePlacementBuilder()
            .side(side)
            .position(position)
            .rotate(false)
            .build())
         .id(id)
         .text(name).build();
   }
}
