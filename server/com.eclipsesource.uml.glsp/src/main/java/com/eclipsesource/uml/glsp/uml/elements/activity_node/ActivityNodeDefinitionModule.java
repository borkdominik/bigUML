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
package com.eclipsesource.uml.glsp.uml.elements.activity_node;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GModelElement;

import com.eclipsesource.uml.glsp.core.gmodel.GModelMapper;
import com.eclipsesource.uml.glsp.core.manifest.DiagramManifest;
import com.eclipsesource.uml.glsp.uml.di.DIProvider;
import com.eclipsesource.uml.glsp.uml.manifest.node.NodeFactoryDefinition;
import com.google.inject.multibindings.Multibinder;

public class ActivityNodeDefinitionModule extends NodeFactoryDefinition {

   public ActivityNodeDefinitionModule(final DiagramManifest manifest) {
      super(manifest.id(), manifest.representation(), ActivityNodeFactory.class);
   }

   @Override
   protected void gmodelMappers(
      final Multibinder<GModelMapper<? extends EObject, ? extends GModelElement>> contribution) {
      super.gmodelMappers(contribution);

      contribution.addBinding()
         .toProvider(
            new DIProvider<>(ActivityNodeFactory.class, (fa) -> fa.acceptEventActionNodeMapper(representation)));
      contribution.addBinding()
         .toProvider(
            new DIProvider<>(ActivityNodeFactory.class, (fa) -> fa.opaqueActionNodeMapper(representation)));
      contribution.addBinding()
         .toProvider(
            new DIProvider<>(ActivityNodeFactory.class, (fa) -> fa.sendSignalActionNodeMapper(representation)));
      contribution.addBinding()
         .toProvider(
            new DIProvider<>(ActivityNodeFactory.class, (fa) -> fa.activityFinalNodeMapper(representation)));
      contribution.addBinding()
         .toProvider(
            new DIProvider<>(ActivityNodeFactory.class, (fa) -> fa.decisionNodeMapper(representation)));
      contribution.addBinding()
         .toProvider(
            new DIProvider<>(ActivityNodeFactory.class, (fa) -> fa.flowFinalNodeMapper(representation)));
      contribution.addBinding()
         .toProvider(
            new DIProvider<>(ActivityNodeFactory.class, (fa) -> fa.forkNodeMapper(representation)));
      contribution.addBinding()
         .toProvider(
            new DIProvider<>(ActivityNodeFactory.class, (fa) -> fa.initialNodeMapper(representation)));
      contribution.addBinding()
         .toProvider(
            new DIProvider<>(ActivityNodeFactory.class, (fa) -> fa.joinNodeMapper(representation)));
      contribution.addBinding()
         .toProvider(
            new DIProvider<>(ActivityNodeFactory.class, (fa) -> fa.mergeNodeMapper(representation)));
      contribution.addBinding()
         .toProvider(
            new DIProvider<>(ActivityNodeFactory.class, (fa) -> fa.activityParameterMapper(representation)));
      contribution.addBinding()
         .toProvider(
            new DIProvider<>(ActivityNodeFactory.class, (fa) -> fa.centralBufferNodeMapper(representation)));

   }
}
