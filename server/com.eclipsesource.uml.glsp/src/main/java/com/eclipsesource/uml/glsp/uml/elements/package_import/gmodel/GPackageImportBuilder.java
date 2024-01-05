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
package com.eclipsesource.uml.glsp.uml.elements.package_import.gmodel;

import java.util.List;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GEdge;
import org.eclipse.uml2.uml.Package;
import org.eclipse.uml2.uml.PackageImport;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.sdk.cdk.GModelContext;
import com.eclipsesource.uml.glsp.sdk.cdk.base.GCProvider;
import com.eclipsesource.uml.glsp.sdk.cdk.gmodel.GCModelList;
import com.eclipsesource.uml.glsp.sdk.ui.builder.GCEdgeBuilder;
import com.eclipsesource.uml.glsp.sdk.utils.StreamUtils;
import com.eclipsesource.uml.glsp.uml.elements.package_.utils.PackageVisibilityKindUtils;

public class GPackageImportBuilder<TOrigin extends PackageImport> extends GCEdgeBuilder<TOrigin> {

   public GPackageImportBuilder(final GModelContext context, final TOrigin origin, final String type) {
      super(context, origin, type);
   }

   @Override
   public EObject source() {
      return nearestPackage();
   }

   public Package nearestPackage() {
      return origin.getNearestPackage();
   }

   @Override
   public EObject target() {
      return importedPackage();
   }

   public Package importedPackage() {
      return origin.getImportedPackage();
   }

   @Override
   protected List<GCProvider> createComponentChildren(final GEdge gmodelRoot, final GCModelList<?, ?> componentRoot) {
      var visibilityLabel = PackageVisibilityKindUtils.visiblityToLabel(origin.getVisibility());
      return List.of(createCenteredLabel(visibilityLabel));
   }

   @Override
   protected List<String> getRootGModelCss() {
      return StreamUtils.concat(super.getDefaultCss(),
         List.of(CoreCSS.EDGE_DASHED, CoreCSS.Marker.TENT.end()));
   }

}
