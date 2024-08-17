/********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.borkdominik.big.glsp.uml.uml.elements.package_.gmodel;

import java.util.List;

import org.eclipse.glsp.graph.GNode;
import org.eclipse.uml2.uml.Package;
import org.eclipse.uml2.uml.PackageableElement;

import com.borkdominik.big.glsp.server.sdk.cdk.GCModelContext;
import com.borkdominik.big.glsp.server.sdk.cdk.base.GCProvider;
import com.borkdominik.big.glsp.server.sdk.cdk.gmodel.GCModelList;
import com.borkdominik.big.glsp.server.sdk.gmodel.BCCompartmentBuilder;
import com.borkdominik.big.glsp.server.sdk.ui.builder.GCNodeBuilder;
import com.borkdominik.big.glsp.uml.uml.elements.named_element.GCNamedElement;

public class GPackageBuilder<TOrigin extends Package> extends GCNodeBuilder<TOrigin> {

   public GPackageBuilder(final GCModelContext context, final TOrigin origin, final String type) {
      super(context, origin, type);
   }

   public List<PackageableElement> packageableElements() {
      return origin.getPackagedElements();
   }

   @Override
   protected List<GCProvider> createComponentChildren(final GNode modelRoot, final GCModelList<?, ?> componentRoot) {
      return List.of(createHeader(componentRoot), createPackageBody(componentRoot));
   }

   protected GCProvider createHeader(final GCModelList<?, ?> root) {
      var namedElementOptions = GCNamedElement.Options.builder()
         .container(root)
         .build();
      return new GCNamedElement<>(context, origin, namedElementOptions);
   }

   protected GCProvider createPackageBody(final GCModelList<?, ?> root) {
      var list = new GCModelList<>(context, origin, new BCCompartmentBuilder<>(origin, context)
         .withFreeformLayout()
         .build());

      list.addAll(providersOf(this.packageableElements()));

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
