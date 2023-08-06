/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.diagram.package_diagram.gmodel;

import java.util.List;

import org.eclipse.glsp.graph.GEdge;
import org.eclipse.glsp.graph.GLabel;
import org.eclipse.glsp.graph.builder.impl.GEdgeBuilder;
import org.eclipse.glsp.graph.builder.impl.GEdgePlacementBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.ElementImport;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.diagram.UmlPackage_ElementImport;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.utils.PackageVisibilityUtils;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGEdgeMapper;
import com.eclipsesource.uml.glsp.uml.gmodel.element.EdgeGBuilder;

public class ElementImportEdgeMapper extends BaseGEdgeMapper<ElementImport, GEdge> implements EdgeGBuilder {

   @Override
   public GEdge map(final ElementImport source) {
      var nearestPackage = source.getNearestPackage();
      var nearestPackageId = idGenerator.getOrCreateId(nearestPackage);
      var importedElement = source.getImportedElement();
      var importedPackageId = idGenerator.getOrCreateId(importedElement);

      GEdgeBuilder builder = new GEdgeBuilder(UmlPackage_ElementImport.typeId())
         .id(idGenerator.getOrCreateId(source))
         .addCssClasses(List.of(CoreCSS.EDGE, CoreCSS.EDGE_DASHED))
         .addCssClass(CoreCSS.Marker.TENT.end())
         .sourceId(nearestPackageId)
         .targetId(importedPackageId)
         .routerKind(GConstants.RouterKind.MANHATTAN)
         .add(buildLabel(source));

      applyEdgeNotation(source, builder);

      return builder.build();
   }

   private GLabel buildLabel(final ElementImport source) {
      var visibilityLabel = PackageVisibilityUtils.visiblityToLabel(source.getVisibility());
      var textBuilder = new StringBuilder(visibilityLabel);
      var alias = source.getAlias();
      if (alias != null && alias.length() > 0) {
         textBuilder.append(" as ");
         textBuilder.append(alias);
      }
      return textEdgeBuilder(
         source,
         textBuilder.toString(),
         new GEdgePlacementBuilder()
            .side(GConstants.EdgeSide.TOP)
            .position(0.5d)
            .rotate(false)
            .build()).build();
   }
}
