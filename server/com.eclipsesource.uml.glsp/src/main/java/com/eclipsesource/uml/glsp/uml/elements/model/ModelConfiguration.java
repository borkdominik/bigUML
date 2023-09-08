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
package com.eclipsesource.uml.glsp.uml.elements.model;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.eclipse.emf.ecore.EClass;
import org.eclipse.glsp.graph.GraphPackage;
import org.eclipse.glsp.server.types.ShapeTypeHint;
import org.eclipse.uml2.uml.Artifact;
import org.eclipse.uml2.uml.DeploymentSpecification;
import org.eclipse.uml2.uml.Device;
import org.eclipse.uml2.uml.ExecutionEnvironment;
import org.eclipse.uml2.uml.Model;

import com.eclipsesource.uml.glsp.uml.configuration.RepresentationNodeConfiguration;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class ModelConfiguration extends RepresentationNodeConfiguration<Model> {

   @Inject
   public ModelConfiguration(@Assisted final Representation representation) {
      super(representation);
   }

   public enum Property {
      NAME,
      URI,
      VISIBILITY_KIND
   }

   @Override
   public Map<String, EClass> getTypeMappings() { return Map.of(
      typeId(), GraphPackage.Literals.GNODE); }

   @Override
   public Set<String> getGraphContainableElements() { return Set.of(typeId()); }

   @Override
   public Set<ShapeTypeHint> getShapeTypeHints() {
      return Set.of(
         new ShapeTypeHint(typeId(), true, true, true, false,
            List.of(
               configurationFor(Artifact.class).typeId(), // behavior deviates from original artifact only on lvl 1
                                                          // allowed see
               configurationFor(Device.class).typeId(), // see device behavior
               configurationFor(DeploymentSpecification.class).typeId(), // see Deployment Sepc behavior
               configurationFor(ExecutionEnvironment.class).typeId(), // see Execution Environment behavior
               configuration().typeId(), // same behavior all levels
               configurationFor(org.eclipse.uml2.uml.Node.class).typeId(), // same behavior as node
               configurationFor(org.eclipse.uml2.uml.Package.class).typeId()))); // same behavior on all levels
   }
}
