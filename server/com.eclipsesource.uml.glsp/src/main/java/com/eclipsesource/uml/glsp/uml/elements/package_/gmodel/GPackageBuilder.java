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
package com.eclipsesource.uml.glsp.uml.elements.package_.gmodel;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.eclipse.glsp.graph.GNode;
import org.eclipse.uml2.uml.Package;
import org.eclipse.uml2.uml.PackageableElement;

import com.eclipsesource.uml.glsp.sdk.cdk.GModelContext;
import com.eclipsesource.uml.glsp.sdk.cdk.base.GCProvider;
import com.eclipsesource.uml.glsp.sdk.cdk.gmodel.GCModelList;
import com.eclipsesource.uml.glsp.sdk.ui.builder.GCNodeBuilder;
import com.eclipsesource.uml.glsp.sdk.ui.components.list.GCList;
import com.eclipsesource.uml.glsp.uml.elements.named_element.GCNamedElement;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGCompartmentBuilder;

public class GPackageBuilder<TOrigin extends Package> extends GCNodeBuilder<TOrigin> {

   public GPackageBuilder(final GModelContext context, final TOrigin origin, final String type) {
      super(context, origin, type);
   }

   public List<PackageableElement> packageableElements() {
      return origin.getPackagedElements();
   }

   @Override
   protected List<GCProvider> createComponentChildren(final GNode modelRoot, final GCModelList<?, ?> componentRoot) {
      return List.of(createHeader(componentRoot), createBody(componentRoot));
   }

   protected GCProvider createHeader(final GCModelList<?, ?> root) {
      var namedElementOptions = new GCNamedElement.Options(root);
      return new GCNamedElement<>(context, origin, namedElementOptions);
   }

   protected GCProvider createBody(final GCModelList<?, ?> root) {
      var options = new GCList.Options();
      options.rootGModel = Optional.of(new UmlGCompartmentBuilder<>(origin, context)
         .withFreeformLayout()
         .build());
      var list = new GCList(context, origin, options);

      list.addAllGModels(packageableElements().stream()
         .map(e -> context.gmodelMapHandler().handle(e))
         .collect(Collectors.toList()));
      list.addAllGModels(packageableElements().stream()
         .map(e -> context.gmodelMapHandler().handleSiblings(e))
         .flatMap(Collection::stream)
         .collect(Collectors.toList()));

      return list;
   }

   /*-
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
   */
}
