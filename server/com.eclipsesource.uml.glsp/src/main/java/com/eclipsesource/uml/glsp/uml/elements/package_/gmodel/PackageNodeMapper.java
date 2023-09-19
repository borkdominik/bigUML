/********************************************************************************
 * Copyright (c) 2021-2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.elements.package_.gmodel;

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
import org.eclipse.uml2.uml.Package;
import org.eclipse.uml2.uml.PackageableElement;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.core.constants.CoreTypes;
import com.eclipsesource.uml.glsp.uml.gmodel.RepresentationGNodeMapper;
import com.eclipsesource.uml.glsp.uml.gmodel.element.NamedElementGBuilder;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public final class PackageNodeMapper extends RepresentationGNodeMapper<Package, GNode>
   implements NamedElementGBuilder<Package> {

   @Inject
   public PackageNodeMapper(@Assisted final Representation representation) {
      super(representation);
   }

   @Override
   public GNode map(final Package source) {
      var builder = new GNodeBuilder(configuration().typeId())
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

      return siblings;
   }

   protected GCompartment buildHeader(final Package source) {
      var builder = compartmentHeaderBuilder(source)
         .layout(GConstants.Layout.HBOX);

      builder.add(buildHeaderName(source, "--uml-package-icon"));

      return builder.build();
   }

   private static final boolean USE_PACKAGE_FOLDER_VIEW = false;

   protected GCompartment buildHeaderVer2(final Package source) {
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

      final var nested = getPackagedElements(source).count();
      if (nested == 0 && !USE_PACKAGE_FOLDER_VIEW) {
         hAlign = GConstants.HAlign.CENTER;
         vAlign = GConstants.VAlign.CENTER;
      }

      return builder.layoutOptions(new GLayoutOptions().vGap(gap).hAlign(hAlign).vAlign(vAlign)).build();
   }

   private Stream<PackageableElement> getPackagedElements(final Package source) {
      return source.getPackagedElements().stream();
   }

   protected GCompartment buildCompartment(final Package source) {
      return freeformChildrenCompartmentBuilder(source)
         .addAll(getPackagedElements(source)
            .map(mapHandler::handle)
            .collect(Collectors.toList()))
         .addAll(getPackagedElements(source)
            .map(mapHandler::handleSiblings)
            .flatMap(Collection::stream)
            .collect(Collectors.toList()))
         .build();
   }
}
