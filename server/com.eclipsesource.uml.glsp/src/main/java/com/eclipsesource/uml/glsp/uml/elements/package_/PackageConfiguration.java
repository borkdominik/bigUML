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
package com.eclipsesource.uml.glsp.uml.elements.package_;

import java.util.Map;
import java.util.Set;

import org.eclipse.emf.ecore.EClass;
import org.eclipse.glsp.graph.GraphPackage;
import org.eclipse.glsp.server.types.ShapeTypeHint;
import org.eclipse.uml2.uml.Artifact;
import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.DataType;
import org.eclipse.uml2.uml.DeploymentSpecification;
import org.eclipse.uml2.uml.Device;
import org.eclipse.uml2.uml.Enumeration;
import org.eclipse.uml2.uml.ExecutionEnvironment;
import org.eclipse.uml2.uml.Interface;
import org.eclipse.uml2.uml.Model;
import org.eclipse.uml2.uml.Package;
import org.eclipse.uml2.uml.PrimitiveType;

import com.eclipsesource.uml.glsp.uml.configuration.RepresentationNodeConfiguration;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class PackageConfiguration extends RepresentationNodeConfiguration<org.eclipse.uml2.uml.Package> {

   @Inject
   public PackageConfiguration(@Assisted final Representation representation) {
      super(representation);
   }

   public enum Property {
      NAME,
      URI,
      VISIBILITY_KIND,
      PACKAGE_IMPORTS,
      PACKAGE_MERGES;
   }

   @Override
   public Map<String, EClass> getTypeMappings() { return Map.of(
      typeId(), GraphPackage.Literals.GNODE); }

   @Override
   public Set<String> getGraphContainableElements() { return Set.of(typeId()); }

   @Override
   public Set<ShapeTypeHint> getShapeTypeHints() {

      return Set.of(
         new ShapeTypeHint(typeId(), true, true, true, false, existingConfigurationTypeIds(
            Set.of(Artifact.class, Class.class, Device.class, DeploymentSpecification.class, Enumeration.class,
               ExecutionEnvironment.class, Interface.class, DataType.class, Model.class,
               org.eclipse.uml2.uml.Node.class,
               PrimitiveType.class, Package.class))));

   }
}
