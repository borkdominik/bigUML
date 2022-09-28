/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.deployment_diagram.constants;

import com.eclipsesource.uml.glsp.utils.UmlConfig;

public final class DeploymentTypes {

   // DEPLOYMENT DIAGRAM
   public static final String ICON_DEPLOYMENT_NODE = UmlConfig.Types.PRE_ICON + "node";
   public static final String DEPLOYMENT_NODE = UmlConfig.Types.PRE_NODE + "node";
   public static final String LABEL_NODE_NAME = UmlConfig.Types.PRE_LABEL + "node:name";
   public static final String ICON_ARTIFACT = UmlConfig.Types.PRE_ICON + "artifact";
   public static final String ARTIFACT = UmlConfig.Types.PRE_NODE + "artifact";
   public static final String COMMUNICATION_PATH = UmlConfig.Types.PRE_EDGE + "communicationpath";
   public static final String DEPLOYMENT = UmlConfig.Types.PRE_EDGE + "deployment";
   public static final String ICON_EXECUTION_ENVIRONMENT = UmlConfig.Types.PRE_ICON + "executionenvironment";
   public static final String EXECUTION_ENVIRONMENT = UmlConfig.Types.PRE_NODE + "executionenvironment";
   public static final String ICON_DEVICE = UmlConfig.Types.PRE_ICON + "device";
   public static final String DEVICE = UmlConfig.Types.PRE_NODE + "device";
   public static final String ICON_DEPLOYMENT_SPECIFICATION = UmlConfig.Types.PRE_ICON + "deploymentspecification";
   public static final String DEPLOYMENT_SPECIFICATION = UmlConfig.Types.PRE_NODE + "deploymentspecification";
   public static final String DEPLOYMENT_COMPONENT = UmlConfig.Types.PRE_NODE + "deploymentcomponent";

   // COMMON CANDIDATE
   public static final String STRUCTURE = "struct";

   // SHARED WITH CLASS AND USECASE
   public static final String LABEL_EDGE_MULTIPLICITY = UmlConfig.Types.PRE_LABEL + "edge-multiplicity";

   private DeploymentTypes() {}
}
