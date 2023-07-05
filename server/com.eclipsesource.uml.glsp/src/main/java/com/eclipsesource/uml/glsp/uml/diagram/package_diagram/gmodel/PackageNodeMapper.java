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

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.eclipse.glsp.graph.GCompartment;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GLabelBuilder;
import org.eclipse.glsp.graph.builder.impl.GLayoutOptions;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.Dependency;
import org.eclipse.uml2.uml.Package;
import org.eclipse.uml2.uml.PackageableElement;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.core.constants.CoreTypes;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.diagram.UmlPackage_Package;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGNodeMapper;
import com.eclipsesource.uml.glsp.uml.gmodel.element.NamedElementGBuilder;

public class PackageNodeMapper extends BaseGNodeMapper<Package, GNode> implements NamedElementGBuilder<Package> {

   private static final boolean USE_PACKAGE_FOLDER_VIEW = false;

   @Override
   public GNode map(final Package source) {
      var builder = new GNodeBuilder(UmlPackage_Package.typeId())
         .id(idGenerator.getOrCreateId(source))
         .layout(GConstants.Layout.VBOX)
         .addCssClass(CoreCSS.NODE)
         .addCssClass("uml-package-node")
         .add(buildHeader(source))
         .add(buildCompartment(source));

      applyShapeNotation(source, builder);

      return builder.build();
   }

   @Override
   public List<GModelElement> mapSiblings(final Package source) {
      var siblings = new ArrayList<GModelElement>();

      siblings.addAll(mapHandler.handle(source.getElementImports()));
      siblings.addAll(mapHandler.handle(source.getPackageImports()));
      siblings.addAll(mapHandler.handle(source.getPackageMerges()));
      siblings.addAll(mapHandler.handle(source.getClientDependencies()));

      return siblings;
   }

   protected GCompartment buildHeader(final Package source) {
      var hAlign = GConstants.HAlign.LEFT;
      var vAlign = GConstants.VAlign.TOP;
      var gap = 0;

      var builder = compartmentHeaderBuilder(source)
         .layout(GConstants.Layout.VBOX)
         .add(buildHeaderName(source, "--uml-package-icon"));

      final var uri = source.getURI();
      if (uri != null && uri.length() > 0) {
         gap = 1;
         builder.add(new GLabelBuilder(CoreTypes.LABEL_TEXT).id(idContextGenerator().getOrCreateId(source))
            .text("{uri=" + uri.toString() + "}").build());
      }

      final var nested = getNestedPackageableElements(source).count();
      if (nested == 0 && !USE_PACKAGE_FOLDER_VIEW) {
         hAlign = GConstants.HAlign.CENTER;
         vAlign = GConstants.VAlign.CENTER;
      }

      return builder.layoutOptions(new GLayoutOptions().vGap(gap).hAlign(hAlign).vAlign(vAlign)).build();
   }

   private Stream<PackageableElement> getNestedPackageableElements(final Package source) {
      return source.getPackagedElements().stream()
         // While dependencies are contained PackagedElements by type,
         // we don't want to consider them as visually contained elements.
         .filter(elem -> !(elem instanceof Dependency));
   }

   protected GCompartment buildCompartment(final Package source) {
      return freeformChildrenCompartmentBuilder(source)
         .addAll(getNestedPackageableElements(source)
            .map(mapHandler::handle)
            .collect(Collectors.toList()))
         .addAll(source.getPackagedElements().stream()
            .map(mapHandler::handleSiblings)
            .flatMap(Collection::stream)
            .collect(Collectors.toList()))
         .build();
   }
}
